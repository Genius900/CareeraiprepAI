import { useState } from 'react'

const questions = [
  { id: 1, category: 'Behavioral', text: 'Tell me about a time you missed a deadline. How did you recover?' },
  { id: 2, category: 'Behavioral', text: 'Give an example of a goal you set and how you achieved it.' },
  { id: 3, category: 'HR', text: 'Where do you see yourself in 5 years?' },
  { id: 4, category: 'Behavioral', text: 'Describe a situation where you had to learn something new under pressure.' },
  { id: 5, category: 'Technical', text: 'Tell me about a project you worked on.' },
  { id: 6, category: 'Behavioral', text: 'Tell me about a time you handled criticism from a senior.' },
  { id: 7, category: 'HR', text: 'Why do you want to work for our company?' },
  { id: 8, category: 'HR', text: 'Why should we hire you over other candidates?' },
  { id: 9, category: 'Technical', text: 'How would you explain a complex topic to someone non-technical?' },
  { id: 10, category: 'Technical', text: 'Which subject did you enjoy most in your course and why?' },
]

const categoryColors = {
  Behavioral: '#f59e0b',
  HR: '#10b981',
  Technical: '#3b82f6',
}

export default function App() {
  const [name, setName] = useState('')
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const getFeedback = async (question, answer) => {
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      })
      const data = await res.json()
      return data
    } catch (e) {
      return { score: 5, feedback: 'Feedback load nahi ho saka. Try again.' }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return
    const q = questions[current]
    const result = await getFeedback(q.text, answer)
    const newResults = [...results, { ...q, answer, score: result.score, feedback: result.feedback }]
    setResults(newResults)
    setAnswer('')
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
    }
  }

  const getTotal = () => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((a, b) => a + b.score, 0) / results.length * 10)
  }

  const getCategoryScore = (cat) => {
    const catResults = results.filter(r => r.category === cat)
    if (catResults.length === 0) return 0
    return Math.round(catResults.reduce((a, b) => a + b.score, 0) / catResults.length * 10)
  }

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>CareerPrep AI</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>10 questions • Hinglish feedback • 15 minutes</p>
          <input
            type="text"
            placeholder="Apna naam enter karo..."
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => name.trim() && setStarted(true)}
            style={{ width: '100%', padding: '14px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Start Mock Interview →
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    const total = getTotal()
    const label = total >= 80 ? 'EXCELLENT!' : total >= 60 ? 'GREAT EFFORT!' : 'GOOD START!'
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '24px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{name} report card</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Here's how you performed across 10 questions.</p>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{total}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>out of 100</div>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Overall interview readiness</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Category breakdown</h3>
            {['Technical', 'HR', 'Behavioral'].map(cat => (
              <div key={cat} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight: 'bold' }}>{getCategoryScore(cat)}%</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: `${getCategoryScore(cat)}%`, background: categoryColors[cat], height: '8px', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#1e40af', borderRadius: '16px', padding: '24px', color: 'white', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>NEXT LEVEL</p>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Want a real human to mentor you 1-on-1?</h3>
            <p style={{ fontSize: '14px', marginBottom: '16px', opacity: 0.9 }}>Resume review + Live mock interview (45 min) + Custom roadmap</p>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>₹ 2,000 <span style={{ fontSize: '14px' }}>/session</span></div>
            <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              Book a Professional 1-on-1 Session
            </button>
          </div>

          <button onClick={() => { setStarted(false); setCurrent(0); setResults([]); setFinished(false); setName('') }}
            style={{ width: '100%', marginTop: '16px', padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
            🔄 Take another mock quiz
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '24px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#1e40af', borderRadius: '8px', padding: '6px 10px', color: 'white', fontSize: '20px' }}>🎯</div>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>CareerPrep AI</span>
          </div>
          <span style={{ color: '#64748b' }}>Question {current + 1} of {questions.length}</span>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <span style={{ background: categoryColors[q.category] + '20', color: categoryColors[q.category], padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
            {q.category}
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '16px 0 24px' }}>{q.text}</h2>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here... (Tip: use specific examples)"
            rows={5}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>{answer.split(' ').filter(Boolean).length} words</p>

          <button
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Evaluating...' : 'Submit Answer →'}
          </button>

          {results[current - 1] && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', textAlign: 'center', minWidth: '50px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{results[current - 1].score}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>/ 10</div>
                </div>
                <p style={{ fontSize: '14px', color: '#374151', flex: 1 }}>{results[current - 1].feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}