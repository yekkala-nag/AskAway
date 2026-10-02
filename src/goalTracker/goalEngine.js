// ============================================================================
// THE 2026 GOAL TRACKER & DATA-DRIVEN VISION BOARD ENGINE
// Python + Streamlit + Neon Serverless PostgreSQL Architecture
// ============================================================================

export const GOAL_CATEGORIES = [
  { id: "health_fitness", name: "Health & Fitness", color: "#3A9B9F", icon: "🏃‍♂️" },
  { id: "ai_engineering", name: "AI Engineering & RAG", color: "#3A9B9F", icon: "🧠" },
  { id: "career_leadership", name: "Career & Leadership", color: "#8b5cf6", icon: "🚀" },
  { id: "finance_wealth", name: "Finance & Investments", color: "#f59e0b", icon: "💰" },
  { id: "mindfulness", name: "Mindfulness & Sleep", color: "#ec4899", icon: "🧘‍♀️" },
  { id: "deep_work", name: "Deep Work & Focus", color: "#6366f1", icon: "⚡" },
  { id: "writing_publishing", name: "Writing & Content", color: "#14b8a6", icon: "✍️" },
  { id: "personal_growth", name: "Personal Growth & Reading", color: "#f97316", icon: "📚" }
];

export const INITIAL_GOALS_CATALOG = [
  // HIGH-FREQUENCY: DAILY HABITS
  { id: 1, title: "7.5+ Hours Quality Sleep", category: "Health & Fitness", frequency: "Daily", targetPerWeek: 7, currentStreak: 12, target: "Daily Check-in" },
  { id: 2, title: "30 Mins RAG / LLM Code Practice", category: "AI Engineering & RAG", frequency: "Daily", targetPerWeek: 7, currentStreak: 18, target: "Daily Check-in" },
  { id: 3, title: "2 Hours Uninterrupted Deep Work", category: "Deep Work & Focus", frequency: "Daily", targetPerWeek: 5, currentStreak: 9, target: "5 Days/Week" },
  { id: 4, title: "10 Mins Meditation & Morning Journal", category: "Mindfulness & Sleep", frequency: "Daily", targetPerWeek: 7, currentStreak: 15, target: "Daily Check-in" },

  // HIGH-FREQUENCY: WEEKLY ROUTINES
  { id: 5, title: "3x Heavy Strength / Gym Workout", category: "Health & Fitness", frequency: "Weekly", targetPerWeek: 3, currentStreak: 4, target: "3 Sessions/Wk" },
  { id: 6, title: "Publish 1 Technical Blog / Case Study", category: "Writing & Content", frequency: "Weekly", targetPerWeek: 1, currentStreak: 3, target: "1 Post/Wk" },
  { id: 7, title: "Review Weekly Portfolio & Expenses", category: "Finance & Investments", frequency: "Weekly", targetPerWeek: 1, currentStreak: 6, target: "1 Review/Wk" },

  // LOW-FREQUENCY: MONTHLY & YEARLY STRATEGIC MILESTONES
  { id: 8, title: "Ship 1 End-to-End Enterprise RAG App", category: "AI Engineering & RAG", frequency: "Monthly", targetPerYear: 12, completedMonths: 2, target: "1 App/Month" },
  { id: 9, title: "Read 2 Industry / Machine Learning Books", category: "Personal Growth & Reading", frequency: "Monthly", targetPerYear: 24, completedMonths: 3, target: "2 Books/Month" },
  { id: 10, title: "Achieve $50k Investments Target 2026", category: "Finance & Investments", frequency: "Yearly", targetPerYear: 1, completedMonths: 0.25, target: "2026 Milestone" }
];

export const MOCK_DAILY_MATRIX = [
  { day: "Mon", date: "2026-02-09", goalId1: true, goalId2: true, goalId3: true, goalId4: true },
  { day: "Tue", date: "2026-02-10", goalId1: true, goalId2: true, goalId3: false, goalId4: true },
  { day: "Wed", date: "2026-02-11", goalId1: true, goalId2: true, goalId3: true, goalId4: true },
  { day: "Thu", date: "2026-02-12", goalId1: false, goalId2: true, goalId3: true, goalId4: false },
  { day: "Fri", date: "2026-02-13", goalId1: true, goalId2: true, goalId3: true, goalId4: true },
  { day: "Sat", date: "2026-02-14", goalId1: true, goalId2: false, goalId3: false, goalId4: true },
  { day: "Sun", date: "2026-02-15", goalId1: true, goalId2: true, goalId3: false, goalId4: true }
];

export const NEON_SQL_SCHEMA = `-- ============================================================================
-- NEON SERVERLESS POSTGRES DATABASE SCHEMA (vision_2026)
-- Execute this script in Neon Console SQL Editor (console.neon.tech)
-- ============================================================================

-- 1. Users Table (Personal Auth & Session Management)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Goals Catalog ("Architect Table")
CREATE TABLE IF NOT EXISTS goals_catalog (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('Daily', 'Weekly', 'Monthly', 'Yearly')),
    target_count INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Daily Tracking (High-Frequency Daily Habits)
CREATE TABLE IF NOT EXISTS daily_tracking (
    id SERIAL PRIMARY KEY,
    goal_id INT REFERENCES goals_catalog(goal_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(goal_id, log_date)
);

-- 4. Weekly Tracking (ISO Week Aggregations)
CREATE TABLE IF NOT EXISTS weekly_tracking (
    id SERIAL PRIMARY KEY,
    goal_id INT REFERENCES goals_catalog(goal_id) ON DELETE CASCADE,
    iso_year INT NOT NULL,
    iso_week INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(goal_id, iso_year, iso_week)
);

-- 5. Long-Term Tracking (Monthly & Yearly Strategic Goals)
CREATE TABLE IF NOT EXISTS long_term_tracking (
    id SERIAL PRIMARY KEY,
    goal_id INT REFERENCES goals_catalog(goal_id) ON DELETE CASCADE,
    period_year INT NOT NULL,
    period_month INT, -- NULL for Yearly goals
    progress_value NUMERIC(10,2) DEFAULT 0.0,
    target_value NUMERIC(10,2) DEFAULT 1.0,
    is_achieved BOOLEAN DEFAULT FALSE,
    notes TEXT
);`;

export const STREAMLIT_PYTHON_CODE = `# ============================================================================
# VISION_2026: STREAMLIT + NEON SERVERLESS POSTGRES CORE IMPLEMENTATION
# File: app.py (Main Streamlit Orchestrator)
# ============================================================================

import streamlit as st
import psycopg2
from psycopg2.extras import RealDictCursor
import datetime

# 1. Neon Database Connection Setup
@st.cache_resource
def init_connection():
    return psycopg2.connect(st.secrets["DATABASE_URL"], cursor_factory=RealDictCursor)

conn = init_connection()

# 2. Page Configuration & Navigation
st.set_page_config(page_title="2026 Vision Board & Goal Tracker", page_icon="🎯", layout="wide")

st.sidebar.title("🎯 Vision 2026 Menu")
page = st.sidebar.radio("Navigate", ["Landing & Auth", "Strategy Setup", "Execution Grid", "Analytics Reports"])

if page == "Strategy Setup":
    st.header("📋 Strategy Setup — Catalog Your 2026 Goals")
    with st.form("new_goal_form"):
        title = st.text_input("Goal Title")
        category = st.selectbox("Category", ["Health & Fitness", "AI Engineering & RAG", "Finance", "Deep Work"])
        frequency = st.selectbox("Frequency", ["Daily", "Weekly", "Monthly", "Yearly"])
        submitted = st.form_submit_button("Add Goal to Catalog")
        if submitted:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO goals_catalog (title, category, frequency) VALUES (%s, %s, %s)", (title, category, frequency))
                conn.commit()
            st.success(f"Added goal: {title}")

elif page == "Execution Grid":
    st.header("⚡ Execution Grid — Matrix Check-Ins")
    today = datetime.date.today()
    st.write(f"Logging for: {today.strftime('%A, %B %d, %Y')}")
    # Render interactive grid & checkboxes...
`;
