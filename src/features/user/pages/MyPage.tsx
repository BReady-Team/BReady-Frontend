import { useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyPage } from '../api'
import type { MyPageDTO } from '../types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import {
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Repeat2,
  Settings,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react'

type TabKey = 'overview' | 'settings'

function formatKoreanDate(isoOrYmd: string) {
  const d = new Date(isoOrYmd.includes('T') ? isoOrYmd : `${isoOrYmd}T00:00:00`)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}. ${m}. ${day}.`
}

function LoadingBox({ text = '불러오는 중...' }: { text?: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6 text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6 text-sm text-destructive">
      {text}
    </div>
  )
}

function StatCard(props: { icon: JSX.Element; value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary/70">
          {props.icon}
        </div>
        <div>
          <div className="text-2xl font-semibold leading-none">{props.value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{props.label}</div>
        </div>
      </div>
    </div>
  )
}

function SettingsRow(props: { icon: JSX.Element; title: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-border/40 bg-card/40 px-6 py-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{props.icon}</span>
        <span className="text-sm font-medium">{props.title}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  )
}

export default function MyPage() {
  const navigate = useNavigate()

  const [tab, setTab] = useState<TabKey>('overview')

  const [data, setData] = useState<MyPageDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Avatar upload/preview
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)

  // Nickname edit
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState('')

  // Bio edit
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bioDraft, setBioDraft] = useState('')

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetchMyPage()
        if (cancelled) return

        setData(res)
        setNicknameDraft(res.profile.nickname)
        setBioDraft(res.profile.bio)
      } catch {
        if (cancelled) return
        setError('마이페이지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const joinedText = useMemo(() => {
    if (!data) return ''
    return `${formatKoreanDate(data.profile.joinedAt)}에 가입`
  }, [data])

  const currentAvatarSrc = avatarPreviewUrl ?? data?.profile.avatarUrl ?? null

  const openFilePicker = () => {
    fileRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    setAvatarPreviewUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const startNicknameEdit = () => {
    if (!data) return
    setNicknameDraft(data.profile.nickname)
    setIsEditingNickname(true)
  }

  const cancelNicknameEdit = () => {
    if (data) setNicknameDraft(data.profile.nickname)
    setIsEditingNickname(false)
  }

  const saveNicknameEdit = () => {
    const next = nicknameDraft.trim()
    if (!next) return

    setData(prev => {
      if (!prev) return prev
      return { ...prev, profile: { ...prev.profile, nickname: next } }
    })
    setIsEditingNickname(false)
  }

  const startBioEdit = () => {
    if (!data) return
    setBioDraft(data.profile.bio)
    setIsEditingBio(true)
  }

  const cancelBioEdit = () => {
    if (data) setBioDraft(data.profile.bio)
    setIsEditingBio(false)
  }

  const saveBioEdit = () => {
    const next = bioDraft.trim()
    setData(prev => {
      if (!prev) return prev
      return { ...prev, profile: { ...prev.profile, bio: next } }
    })
    setIsEditingBio(false)
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-8">
      {/* Profile header */}
      <section className="rounded-2xl border border-border/40 bg-card/50 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <button
                type="button"
                onClick={openFilePicker}
                className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary/10"
                aria-label="프로필 사진 변경"
              >
                {currentAvatarSrc ? (
                  <img
                    src={currentAvatarSrc}
                    alt="프로필 이미지"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary/60" aria-hidden="true" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/35" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white/90" aria-hidden="true" />
                </div>
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Profile text */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {!isEditingNickname ? (
                  <>
                    <h1 className="text-2xl font-semibold">
                      {loading ? '불러오는 중…' : (data?.profile.nickname ?? '—')}
                    </h1>

                    <button
                      type="button"
                      onClick={startNicknameEdit}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-card/40 text-muted-foreground shadow-sm transition-colors duration-200 hover:bg-card/70 hover:text-foreground"
                      aria-label="닉네임 수정"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nicknameDraft}
                      onChange={e => setNicknameDraft(e.target.value)}
                      aria-label="닉네임 입력"
                      maxLength={20}
                      className="h-10 w-[240px]"
                    />

                    <button
                      type="button"
                      onClick={saveNicknameEdit}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors duration-200 hover:bg-primary/10"
                      aria-label="닉네임 저장"
                    >
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={cancelNicknameEdit}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-card text-muted-foreground shadow-sm transition-colors duration-200"
                      aria-label="닉네임 취소"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{data?.profile.email ?? ''}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-destructive transition-opacity duration-200 hover:opacity-80"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={cn(
            'rounded-xl border border-border/40 py-3 font-medium transition-colors duration-200',
            tab === 'overview' ? 'bg-card/60' : 'bg-card/30 text-muted-foreground hover:bg-card/40',
          )}
        >
          개요
        </button>

        <button
          type="button"
          onClick={() => setTab('settings')}
          className={cn(
            'rounded-xl border border-border/40 py-3 font-medium transition-colors duration-200',
            tab === 'settings' ? 'bg-card/60' : 'bg-card/30 text-muted-foreground hover:bg-card/40',
          )}
        >
          설정
        </button>
      </div>

      {tab === 'overview' ? (
        <>
          {/* Bio */}
          <section className="rounded-2xl border border-border/40 bg-card/50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full space-y-2">
                <p className="text-xs text-muted-foreground">소개</p>

                {loading ? (
                  <p className="text-sm text-muted-foreground">불러오는 중...</p>
                ) : isEditingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={bioDraft}
                      onChange={e => setBioDraft(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-border/40 bg-background/30 p-3 text-sm outline-none focus:ring-1 focus:ring-primary/40"
                      aria-label="소개 입력"
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelBioEdit}
                        className="transition-colors hover:bg-white/10"
                      >
                        취소
                      </Button>
                      <Button type="button" onClick={saveBioEdit}>
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{data?.profile.bio ?? ''}</p>
                )}
              </div>

              {!isEditingBio && (
                <button
                  type="button"
                  onClick={startBioEdit}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
                  aria-label="소개 수정"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  <span className="whitespace-nowrap">수정</span>
                </button>
              )}
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
              value={data?.stats.totalPlans ?? 0}
              label="총 플랜"
            />
            <StatCard
              icon={<Repeat2 className="h-5 w-5" aria-hidden="true" />}
              value={data?.stats.totalSwitches ?? 0}
              label="총 전환"
            />
            <StatCard
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              value={data?.stats.totalSwitchLogs ?? 0}
              label="전환 기록"
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">최근 플랜</h2>

              <Link
                to="/plans"
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                전체 보기
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <LoadingBox />
              ) : error ? (
                <ErrorBox text={error} />
              ) : (data?.recentPlans ?? []).length === 0 ? (
                <div className="rounded-2xl border border-border/40 bg-card/50 p-6 text-sm text-muted-foreground">
                  최근 플랜이 없습니다.
                </div>
              ) : (
                (data?.recentPlans ?? []).map(p => (
                  <Link
                    key={p.id}
                    to={`/plans/${p.id}`}
                    className="group block w-full rounded-2xl border border-border/40 bg-card p-6 text-left shadow-sm transition-colors duration-200 hover:border-primary/60 hover:bg-secondary/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                          {p.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" aria-hidden="true" />
                            {formatKoreanDate(p.date)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            {p.region}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <footer className="rounded-2xl border border-border/40 bg-card/30 py-5 text-center text-xs text-muted-foreground">
            {loading ? '—' : joinedText}
          </footer>
        </>
      ) : (
        <section className="space-y-3">
          <SettingsRow
            icon={<Shield className="h-5 w-5" aria-hidden="true" />}
            title="개인정보 및 보안"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<Settings className="h-5 w-5" aria-hidden="true" />}
            title="설정"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<Trash2 className="h-5 w-5" aria-hidden="true" />}
            title="회원 탈퇴"
            onClick={() => {}}
          />
        </section>
      )}
    </main>
  )
}
