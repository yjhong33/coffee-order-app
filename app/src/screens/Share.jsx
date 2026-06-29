import { ChevronLeft, LinkIcon, KakaoIcon, GridIcon, QrSample, ChevronRight, PersonIcon, RefreshIcon } from '../icons'

export default function Share({ participants, confirmedCount, onBack, onCopyLink, onCopyCode, onShareKakao, onFinish, onGoParticipant, onRefresh }) {
  return (
    <div style={{ padding: '0 0 40px', animation: 'cc-fade .2s ease' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--cc-cream)', padding: '54px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: -8 }}>
            <ChevronLeft />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>공유 및 참여</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cc-green)' }}></div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 18, padding: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--cc-ink2)', fontWeight: 600 }}>참여 코드</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, color: 'var(--cc-green)', marginTop: 6 }}>C4F9</div>
          <div style={{ width: 150, height: 150, margin: '16px auto 0', borderRadius: 18, background: '#fff', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
            <QrSample />
          </div>
          <div style={{ fontSize: 12, color: 'var(--cc-ink3)', marginTop: 12 }}>QR을 찍거나 코드를 입력하면 바로 참여할 수 있어요</div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <div onClick={onCopyLink} style={{ flex: 1, background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ marginBottom: 6 }}>
              <LinkIcon />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>링크 복사</div>
          </div>
          <div onClick={onShareKakao} style={{ flex: 1, background: '#FEE500', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ marginBottom: 6 }}>
              <KakaoIcon />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#3C1E1E' }}>카카오톡 공유</div>
          </div>
          <div onClick={onCopyCode} style={{ flex: 1, background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ marginBottom: 6 }}>
              <GridIcon />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>코드 복사</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}>
            카카오톡 공유 미리보기 <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--cc-ink3)' }}>전송 전 이렇게 보여요</span>
          </div>
          <div style={{ background: '#A6C3D6', borderRadius: 18, padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: 12, background: '#1F6E50', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flex: 'none' }}>C</div>
              <div style={{ background: '#fff', borderRadius: '4px 16px 16px 16px', padding: 0, overflow: 'hidden', maxWidth: 230 }}>
                <div style={{ height: 96, background: 'linear-gradient(135deg,#21795A,#185940)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.85)' }}>CALLCOFFEE</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>함께 커피 주문해요 ☕</span>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>스타벅스 강남R점 그룹 주문</div>
                  <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 3, lineHeight: 1.4 }}>버튼을 눌러 내 메뉴를 추가하거나 확인하세요. 코드 C4F9</div>
                  <div style={{ marginTop: 11, background: 'var(--cc-band)', borderRadius: 9, textAlign: 'center', padding: 9, fontSize: 13, fontWeight: 700, color: 'var(--cc-green)' }}>주문 참여하기</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div onClick={onGoParticipant} style={{ marginTop: 20, background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--cc-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <PersonIcon color="#1F6E50" size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>직접 등록</div>
            <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 2 }}>직접 이름과 메뉴를 등록할 수 있어요</div>
          </div>
          <ChevronRight color="#9A9082" size={18} />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>참여자 확인 현황</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div onClick={onRefresh} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--cc-card)', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshIcon />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-green)', background: 'var(--cc-green-soft)', padding: '4px 9px', borderRadius: 8 }}>{confirmedCount}/{participants.length} 확인 · 실시간</div>
            </div>
          </div>
          {participants.map((pt) => {
            const avatarText = pt.name === '나' ? '나' : pt.name.slice(-2)
            return (
              <div key={pt.name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', background: 'var(--cc-card)', border: '1px solid var(--cc-line)', borderRadius: 14, marginBottom: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flex: 'none', background: pt.bg, color: '#fff' }}>{avatarText}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{pt.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--cc-ink2)', marginTop: 2 }}>{pt.order}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: pt.ok ? 'var(--cc-green)' : 'var(--cc-ink3)' }}>
                  {pt.ok ? '● ' : '○ '}
                  {pt.ok ? '확인 완료' : '대기 중'}
                </span>
              </div>
            )
          })}
        </div>

        <div onClick={onFinish} style={{ marginTop: 18, background: 'var(--cc-green-deep)', borderRadius: 15, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>주문 마감하고 완료하기</span>
        </div>
      </div>
    </div>
  )
}
