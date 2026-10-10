import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  // pre-existing exports still intact
  THREE_RL_BASELINES,
  SIMULATE_DYNAMIC_PRICING_MDP,
  createSeededRng,
  // qlearn merge exports
  QLEARN_REWARDS,
  QLEARN_INVALID_PENALTY,
  encodeBoard,
  availableMoves,
  checkWinner,
  qGet,
  qSet,
  qUpdate,
  runQLearningSession,
  topQEntries
} from '../src/reinforcementLearning/rlEngine.js';

describe('qlearnMerge engine intact', () => {
  it('keeps the original baselines export', () => {
    assert.equal(THREE_RL_BASELINES.length, 4);
    assert.equal(typeof SIMULATE_DYNAMIC_PRICING_MDP, 'function');
    assert.equal(typeof createSeededRng, 'function');
  });

  it('exposes the shaped rewards', () => {
    assert.deepEqual(QLEARN_REWARDS, { win: 1, draw: 0.5, loss: -1, invalid: -5, ongoing: 0 });
    assert.equal(QLEARN_INVALID_PENALTY, -5);
  });
});

describe('qlearnMerge board helpers', () => {
  it('encodes boards to 9-char keys', () => {
    assert.equal(encodeBoard([1, 0, 2, 0, 0, 0, 0, 0, 0]), '102000000');
    assert.equal(encodeBoard([0, 0, 0, 0, 0, 0, 0, 0, 0]), '000000000');
  });

  it('lists only empty cells as moves', () => {
    assert.deepEqual(availableMoves([1, 0, 2, 0, 0, 0, 0, 0, 0]), [1, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual(availableMoves([1, 2, 1, 2, 1, 2, 1, 2, 1]), []);
  });

  it('detects X wins, O wins, draws, and open games', () => {
    assert.equal(checkWinner([1, 1, 1, 0, 2, 0, 0, 0, 2]), 'X');
    assert.equal(checkWinner([2, 1, 1, 0, 2, 0, 1, 0, 2]), 'O');
    assert.equal(checkWinner([1, 2, 1, 1, 2, 2, 2, 1, 1]), 'draw');
    assert.equal(checkWinner([1, 0, 0, 0, 2, 0, 0, 0, 0]), null);
  });
});

describe('qlearnMerge Q-table helpers', () => {
  it('reads unknown entries as zero knowledge', () => {
    assert.equal(qGet({}, '000000000', 4), 0);
  });

  it('round-trips qSet / qGet', () => {
    const table = {};
    qSet(table, '100000000', 4, 0.75);
    assert.equal(qGet(table, '100000000', 4), 0.75);
    assert.equal(qGet(table, '100000000', 3), 0);
  });

  it('applies the alpha/gamma update exactly', () => {
    assert.equal(qUpdate(0, 1, 0, 0.5, 0.9), 0.5);
    assert.equal(qUpdate(0.5, 0, 0, 0.5, 0.9), 0.25);
  });
});

describe('qlearnMerge training session', () => {
  const CFG = { episodes: 2000, alpha: 0.2, gamma: 0.9, epsilon: 0.15, seed: 21 };

  it('is deterministic per seed', () => {
    const a = runQLearningSession(CFG);
    const b = runQLearningSession(CFG);
    assert.deepEqual(a.blocks, b.blocks);
    assert.equal(a.wins, b.wins);
    assert.equal(a.tableSize, b.tableSize);
    assert.equal(a.invalidMoveRate, b.invalidMoveRate);
  });

  it('reports exact totals for the reference seed', () => {
    const s = runQLearningSession(CFG);
    assert.equal(s.wins, 1630);
    assert.equal(s.draws, 179);
    assert.equal(s.losses, 191);
    assert.equal(s.tableSize, 2307);
    assert.equal(s.totalInvalids, 1788);
    assert.equal(s.totalAgentMoves, 9141);
    assert.equal(s.invalidMoveRate, 0.19560223170331473);
  });

  it('splits episodes into exact per-block wins/draws/losses', () => {
    const s = runQLearningSession(CFG);
    assert.equal(s.blocks.length, 10);
    assert.deepEqual(s.blocks[0], { block: 1, episodes: 200, wins: 153, draws: 16, losses: 31, invalids: 486 });
    assert.deepEqual(s.blocks[9], { block: 10, episodes: 200, wins: 167, draws: 14, losses: 19, invalids: 90 });
    let totals = 0;
    for (const blk of s.blocks) {
      assert.equal(blk.wins + blk.draws + blk.losses, blk.episodes);
      totals += blk.episodes;
    }
    assert.equal(totals, 2000);
    assert.equal(s.wins + s.draws + s.losses, 2000);
  });

  it('shows the learning-curve signature: losses fall, wins climb', () => {
    const s = runQLearningSession(CFG);
    const firstHalf = s.blocks.slice(0, 5);
    const secondHalf = s.blocks.slice(5);
    const sum = (rows, k) => rows.reduce((acc, r) => acc + r[k], 0);
    assert.ok(sum(secondHalf, 'losses') < sum(firstHalf, 'losses'));
    assert.ok(sum(secondHalf, 'wins') >= sum(firstHalf, 'wins'));
    assert.ok(s.blocks[9].losses < s.blocks[0].losses);
  });

  it('trains invalid moves out: rate drops and table grows', () => {
    const short = runQLearningSession({ ...CFG, episodes: 200 });
    const long = runQLearningSession(CFG);
    assert.deepEqual([short.wins, short.draws, short.losses], [153, 16, 31]);
    assert.equal(short.tableSize, 674);
    assert.equal(short.invalidMoveRate, 0.3996710526315789);
    assert.ok(long.blocks[9].invalids < long.blocks[0].invalids);
    assert.ok(long.invalidMoveRate < short.invalidMoveRate);
    assert.ok(long.tableSize > short.tableSize);
  });

  it('returns the final board position and top Q entries', () => {
    const s = runQLearningSession(CFG);
    assert.deepEqual(s.finalBoard, [1, 1, 1, 0, 2, 2, 2, 1, 0]);
    assert.equal(s.finalResult, 'win');
    const top = topQEntries(s.table, 3);
    assert.equal(top.length, 3);
    assert.ok(top[0].value >= top[1].value && top[1].value >= top[2].value);
    assert.ok(top[0].value > 0.99);
    assert.equal(typeof top[0].state, 'string');
    assert.equal(typeof top[0].action, 'number');
  });

  it('trains a few thousand episodes in under a second', () => {
    const t0 = Date.now();
    runQLearningSession(CFG);
    assert.ok(Date.now() - t0 < 1000);
  });
});
