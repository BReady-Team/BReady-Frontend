import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function onlyDigits(v: string, maxLen: number) {
  return v.replace(/\D/g, '').slice(0, maxLen)
}

function isValidDateParts(year: string, month: string, day: string) {
  if (year.length !== 4) return false
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return false
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

export default function PlanCreatePage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [region, setRegion] = useState('')

  const dateOk = isValidDateParts(year, month, day)
  const canSubmit = title.trim().length > 0 && region.trim().length > 0 && dateOk

  const handleSubmit = () => {
    // TODO: API 연동
    navigate('/plans')
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">새 플랜 만들기</h1>
        <p className="text-sm text-muted-foreground">하루 일정의 기본 정보를 입력하세요</p>
      </header>

      <section className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">플랜 제목</Label>
          <Input
            id="title"
            placeholder="예: 성수동 데이트"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>날짜</Label>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">년</span>
              <Input
                aria-label="년"
                placeholder="2026"
                value={year}
                onChange={e => setYear(onlyDigits(e.target.value, 4))}
                inputMode="numeric"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">월</span>
              <Input
                aria-label="월"
                placeholder="1"
                value={month}
                onChange={e => setMonth(onlyDigits(e.target.value, 2))}
                inputMode="numeric"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">일</span>
              <Input
                aria-label="일"
                placeholder="20"
                value={day}
                onChange={e => setDay(onlyDigits(e.target.value, 2))}
                inputMode="numeric"
              />
            </div>
          </div>

          {(year || month || day) && !dateOk && (
            <p className="text-xs text-destructive">올바른 날짜를 입력해주세요.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">지역</Label>
          <Input
            id="region"
            placeholder="예: 서울 성수동"
            value={region}
            onChange={e => setRegion(e.target.value)}
          />
        </div>
      </section>

      <footer className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full transition-colors hover:bg-white/10"
        >
          취소
        </Button>

        <Button onClick={handleSubmit} className="w-full" disabled={!canSubmit}>
          플랜 생성
        </Button>
      </footer>
    </main>
  )
}
