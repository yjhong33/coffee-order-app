import { CloseIcon, CameraIcon, GalleryIcon, SpinnerIcon, CheckIcon } from '../icons'
import { SAMPLE_CHAT, CAP_PEOPLE, ANALYZE_STEPS } from '../data'

const FLAGGED_NAME = '이서연'

export default function CaptureOverlay({ step, analyzeIdx, onClose, onStart, onApprove, capFlagTemp, onResolveFlag }) {
  const flagResolved = !!capFlagTemp
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div className="cc-scroll" style={{ width: '100%', maxHeight: '90%', overflowY: 'auto', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(20px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>캡처 이미지 분석</div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        </div>

        {step === 'upload' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--cc-ink2)', lineHeight: 1.5, marginBottom: 14 }}>카카오톡 단체방의 주문 대화를 캡처해서 올려주세요. 사람별로 메뉴를 자동으로 정리해 드려요.</div>
            <div style={{ background: '#9DB7C9', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.85)', marginBottom: 8, textAlign: 'center' }}>📷 이런 캡처를 올리면 돼요</div>
              {SAMPLE_CHAT.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: c.me ? 'flex-end' : 'flex-start', marginBottom: 7 }}>
                  <div style={{ maxWidth: '75%', background: c.me ? '#FEE500' : '#fff', borderRadius: 12, padding: '7px 11px' }}>
                    {!c.me && <div style={{ fontSize: 11, color: 'rgba(0,0,0,.45)', marginBottom: 2, fontWeight: 600 }}>{c.name}</div>}
                    <span style={{ fontSize: 14, color: '#1A1A1A' }}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <div onClick={onStart} style={{ flex: 1, background: 'var(--cc-band)', borderRadius: 14, padding: 15, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ marginBottom: 5 }}>
                  <CameraIcon />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-ink2)' }}>카메라</div>
              </div>
              <div onClick={onStart} style={{ flex: 1, background: 'var(--cc-green)', borderRadius: 14, padding: 15, textAlign: 'center', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.28)' }}>
                <div style={{ marginBottom: 5 }}>
                  <GalleryIcon />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>갤러리에서 선택</div>
              </div>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div style={{ marginTop: 24, textAlign: 'center', paddingBottom: 10 }}>
            <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto' }}>
              <SpinnerIcon />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 18 }}>대화를 분석하고 있어요</div>
            <div style={{ fontSize: 14, color: 'var(--cc-ink2)', marginTop: 6 }}>잠시만요, 사람별 메뉴를 정리하는 중이에요</div>
            <div style={{ marginTop: 20, textAlign: 'left', background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 16, padding: '6px 16px' }}>
              {ANALYZE_STEPS.map((label, i) => {
                const isDone = i < analyzeIdx
                const active = i === analyzeIdx
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i === ANALYZE_STEPS.length - 1 ? 'none' : '1px solid var(--cc-line)' }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        flex: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isDone ? 'var(--cc-green)' : active ? 'var(--cc-gold)' : 'var(--cc-band)',
                        color: '#fff',
                        fontSize: 13,
                      }}
                    >
                      {isDone ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isDone || active ? 'var(--cc-ink)' : 'var(--cc-ink3)' }}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ background: 'var(--cc-green-soft)', borderRadius: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckIcon size={22} strokeWidth="2.2" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-green-strong)' }}>{CAP_PEOPLE.length}명의 주문을 찾았어요</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>원본과 비교해 확인한 뒤 추가하세요</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <div style={{ flex: 1, background: '#9DB7C9', borderRadius: 14, padding: 11 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.9)', marginBottom: 7 }}>원본 캡처</div>
                {SAMPLE_CHAT.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: c.me ? 'flex-end' : 'flex-start', marginBottom: 5 }}>
                    <div style={{ maxWidth: '80%', background: c.me ? '#FEE500' : '#fff', borderRadius: 9, padding: '5px 8px' }}>
                      <span style={{ fontSize: 12, color: '#1A1A1A' }}>{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, background: '#fff', border: '1px solid var(--cc-line)', borderRadius: 14, padding: 11 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-green)', marginBottom: 7 }}>정리된 결과</div>
                {CAP_PEOPLE.map((cp, i) => {
                  const flagged = cp.name === FLAGGED_NAME
                  const temp = flagged ? capFlagTemp || cp.temp : cp.temp
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: '1px solid var(--cc-line)' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 5px',
                          borderRadius: 5,
                          flex: 'none',
                          background: temp === 'HOT' ? 'var(--cc-hot-bg)' : 'var(--cc-ice-bg)',
                          color: temp === 'HOT' ? 'var(--cc-hot)' : 'var(--cc-ice)',
                        }}
                      >
                        {flagged && !flagResolved ? '?' : temp}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cp.menu}</div>
                        <div style={{ fontSize: 11, color: 'var(--cc-ink3)' }}>{cp.name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {!flagResolved && (
              <div style={{ marginTop: 14, background: 'var(--cc-gold-soft)', border: '1px solid var(--cc-gold)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#9A6F26' }}>{FLAGGED_NAME} 님의 온도가 명확하지 않아요</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 4 }}>HOT인지 ICE인지 선택해 주세요</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <div onClick={() => onResolveFlag('HOT')} style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, padding: 10, borderRadius: 10, cursor: 'pointer', background: '#fff', color: 'var(--cc-hot)', border: '1px solid var(--cc-hot)' }}>
                    HOT
                  </div>
                  <div onClick={() => onResolveFlag('ICE')} style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, padding: 10, borderRadius: 10, cursor: 'pointer', background: '#fff', color: 'var(--cc-ice)', border: '1px solid var(--cc-ice)' }}>
                    ICE
                  </div>
                </div>
              </div>
            )}

            <div style={{ fontSize: 13, color: 'var(--cc-ink3)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
              혹시 잘못 인식된 게 있다면, 추가한 뒤
              <br />
              취합 화면에서 바로 수정할 수 있어요
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <div onClick={onClose} style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>취소</div>
              <div
                onClick={flagResolved ? onApprove : undefined}
                style={{
                  flex: 2,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  padding: 15,
                  borderRadius: 14,
                  background: flagResolved ? 'var(--cc-green)' : 'var(--cc-band)',
                  color: flagResolved ? '#fff' : 'var(--cc-ink3)',
                  cursor: flagResolved ? 'pointer' : 'not-allowed',
                  boxShadow: flagResolved ? '0 8px 18px rgba(31,110,80,.3)' : 'none',
                }}
              >
                {CAP_PEOPLE.length}명 모두 추가하기
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
