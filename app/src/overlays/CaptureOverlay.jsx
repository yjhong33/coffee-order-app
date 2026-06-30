import { useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import { CloseIcon, CameraIcon, GalleryIcon, SpinnerIcon, CheckIcon, MinusIcon, PlusIcon } from '../icons'
import { parseKakaoChat } from '../kakaoParser'
import { analyzeOrders, aggregateOrders, menuDisplay, tempLabel } from '../orderAnalyzer'

function TempToggle({ temp, need, onPick }) {
  return (
    <div style={{ display: 'flex', gap: 4, flex: 'none', background: 'var(--cc-surface)', borderRadius: 9, padding: 3, border: need ? '1.5px solid var(--cc-warn-line)' : '1px solid var(--cc-line)' }}>
      {['ICE', 'HOT'].map((t) => {
        const on = temp === t
        return (
          <span
            key={t}
            onClick={() => onPick(t)}
            style={{
              fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 7, cursor: 'pointer',
              background: on ? (t === 'ICE' ? 'var(--cc-ice-bg)' : 'var(--cc-hot-bg)') : 'transparent',
              color: on ? (t === 'ICE' ? 'var(--cc-ice)' : 'var(--cc-hot)') : 'var(--cc-ink3)',
            }}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

export default function CaptureOverlay({ onClose, onApprove }) {
  const [step, setStep] = useState('upload') // upload | analyzing | result
  const [progress, setProgress] = useState({ img: 0, total: 0, pct: 0 })
  const [orders, setOrders] = useState([])
  const [review, setReview] = useState([])
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // allow re-selecting the same files
    if (!files.length) return
    setError('')
    setStep('analyzing')
    setProgress({ img: 0, total: files.length, pct: 0 })
    try {
      const worker = await createWorker('kor+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress((p) => ({ ...p, pct: Math.round((m.progress || 0) * 100) }))
        },
      })
      const all = []
      for (let i = 0; i < files.length; i++) {
        setProgress((p) => ({ ...p, img: i + 1, pct: 0 }))
        const { data } = await worker.recognize(files[i])
        all.push(...parseKakaoChat(data.text, i))
      }
      await worker.terminate()

      const { orders: ords, review: rev } = analyzeOrders(all)
      if (!ords.length && !rev.length) {
        setError('주문 메시지를 찾지 못했어요. 대화가 또렷하게 보이는 캡처로 다시 시도해 주세요.')
        setStep('upload')
        return
      }
      setOrders(ords.map((o, i) => ({ ...o, id: `o${i}` })))
      setReview(rev.map((r, i) => ({ ...r, id: `r${i}`, include: false, temp: r.temp, qty: r.qty || 1, menu: r.menu || '' })))
      setStep('result')
    } catch {
      setError('이미지 분석에 실패했어요. 네트워크를 확인하고 다시 시도해 주세요.')
      setStep('upload')
    }
  }

  function setOrderTemp(id, temp) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, temp } : o)))
  }
  function changeOrderQty(id, d) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, qty: Math.max(1, o.qty + d) } : o)))
  }
  function removeOrder(id) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }
  function updateReview(id, patch) {
    setReview((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const includedReview = review.filter((r) => r.include && r.menu && r.temp)
  const finalOrders = [...orders, ...includedReview]
  const needCount = orders.filter((o) => !o.temp).length + review.filter((r) => r.include && (!r.menu || !r.temp)).length
  const aggregate = aggregateOrders(finalOrders.filter((o) => o.temp))

  function approve() {
    if (!finalOrders.length) {
      onClose()
      return
    }
    if (needCount > 0) return
    onApprove(finalOrders.map((o) => ({ name: o.name, menu: o.menu, temp: o.temp, qty: o.qty, price: o.price || 4500, options: o.options || [] })))
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(18,14,8,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', animation: 'cc-fade .2s ease' }}>
      <div className="cc-scroll" style={{ width: '100%', maxHeight: '92%', overflowY: 'auto', background: 'var(--cc-cream)', borderRadius: '24px 24px 0 0', padding: '22px 20px calc(20px + env(safe-area-inset-bottom))', animation: 'cc-sheet .28s cubic-bezier(.2,.8,.2,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--cc-line)', margin: '0 auto 18px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.4px' }}>캡처로 주문 정리</div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />

        {step === 'upload' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--cc-ink2)', lineHeight: 1.5, marginBottom: 14 }}>
              카카오톡 단체방의 주문 대화를 캡처해서 올려주세요. 여러 장도 한 번에 올릴 수 있고, 사람별·메뉴별로 자동 정리해 드려요.
            </div>
            {error && (
              <div style={{ background: 'var(--cc-hot-bg)', color: 'var(--cc-hot)', borderRadius: 12, padding: '11px 13px', fontSize: 13, fontWeight: 600, marginBottom: 14, lineHeight: 1.45 }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <div onClick={() => fileRef.current?.click()} style={{ flex: 1, background: 'var(--cc-band)', borderRadius: 14, padding: 15, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ marginBottom: 5 }}><CameraIcon /></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-ink2)' }}>카메라</div>
              </div>
              <div onClick={() => fileRef.current?.click()} style={{ flex: 1, background: 'var(--cc-green)', borderRadius: 14, padding: 15, textAlign: 'center', cursor: 'pointer', boxShadow: '0 8px 18px rgba(31,110,80,.28)' }}>
                <div style={{ marginBottom: 5 }}><GalleryIcon /></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>갤러리에서 선택</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--cc-ink3)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
              대화가 또렷하게 보일수록 인식이 정확해요. 처음 한 번은 인식 데이터를 받느라 조금 걸릴 수 있어요.
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div style={{ marginTop: 24, textAlign: 'center', paddingBottom: 10 }}>
            <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto' }}><SpinnerIcon /></div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 18 }}>대화를 분석하고 있어요</div>
            <div style={{ fontSize: 14, color: 'var(--cc-ink2)', marginTop: 6 }}>
              이미지 {progress.img}/{progress.total} · 텍스트 인식 {progress.pct}%
            </div>
            <div style={{ marginTop: 18, height: 8, borderRadius: 5, background: 'var(--cc-band)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress.total ? ((progress.img - 1 + progress.pct / 100) / progress.total) * 100 : 0}%`, background: 'var(--cc-green)', transition: 'width .3s ease' }}></div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ background: 'var(--cc-green-soft)', borderRadius: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckIcon size={22} strokeWidth="2.2" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cc-green-strong)' }}>{orders.length}명의 주문을 정리했어요</div>
                <div style={{ fontSize: 13, color: 'var(--cc-ink2)', marginTop: 2 }}>확인 후 추가하세요{review.length ? ` · 확인 필요 ${review.length}건` : ''}</div>
              </div>
            </div>

            {needCount > 0 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cc-warn-ink)', background: 'var(--cc-gold-soft)', borderRadius: 11, padding: '10px 12px', marginTop: 12, lineHeight: 1.45 }}>
                ⚠️ 온도가 정해지지 않은 메뉴가 있어요. 아이스/핫을 골라주세요.
              </div>
            )}

            {/* per-person orders */}
            <div style={{ fontSize: 14, fontWeight: 800, margin: '16px 0 10px' }}>사람별 주문</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ background: !o.temp ? 'var(--cc-warn-soft)' : '#fff', border: `1px solid ${!o.temp ? 'var(--cc-warn-line)' : 'var(--cc-line)'}`, borderRadius: 13, padding: 11, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <TempToggle temp={o.temp} need={!o.temp} onPick={(t) => setOrderTemp(o.id, t)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.menu}</div>
                    <div style={{ fontSize: 12, color: 'var(--cc-ink3)', marginTop: 1 }}>
                      {o.name}
                      {o.options && o.options.length > 0 && <span style={{ color: 'var(--cc-gold)' }}> · {o.options.join(', ')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 'none' }}>
                    <div onClick={() => changeOrderQty(o.id, -1)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MinusIcon /></div>
                    <span style={{ fontSize: 14, fontWeight: 800, minWidth: 14, textAlign: 'center' }}>{o.qty}</span>
                    <div onClick={() => changeOrderQty(o.id, 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon color="#1F6E50" size={15} strokeWidth="2.6" /></div>
                  </div>
                  <div onClick={() => removeOrder(o.id)} style={{ width: 22, flex: 'none', textAlign: 'center', cursor: 'pointer', color: 'var(--cc-ink3)', fontSize: 18 }}>×</div>
                </div>
              ))}
              {orders.length === 0 && <div style={{ fontSize: 13, color: 'var(--cc-ink3)', padding: '4px 2px' }}>자동으로 확정된 주문이 없어요. 아래 확인 필요 항목을 검토해 주세요.</div>}
            </div>

            {/* menu aggregate */}
            {aggregate.length > 0 && (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, margin: '18px 0 10px' }}>메뉴별 집계</div>
                <div style={{ background: 'var(--cc-surface)', border: '1px solid var(--cc-line)', borderRadius: 13, padding: '4px 14px' }}>
                  {aggregate.map((a) => (
                    <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--cc-line)' }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--cc-green)' }}>{a.qty}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* review / 확인 필요 */}
            {review.length > 0 && (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, margin: '18px 0 10px', color: 'var(--cc-warn-ink)' }}>확인 필요 ({review.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {review.map((r) => (
                    <div key={r.id} style={{ background: 'var(--cc-warn-soft)', border: '1px solid var(--cc-warn-line)', borderRadius: 13, padding: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-ink2)', flex: 'none' }}>{r.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--cc-ink3)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>“{r.message}”</span>
                        <span
                          onClick={() => updateReview(r.id, { include: !r.include })}
                          style={{ fontSize: 12, fontWeight: 800, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', flex: 'none', background: r.include ? 'var(--cc-green)' : '#fff', color: r.include ? '#fff' : 'var(--cc-green)', border: '1px solid var(--cc-green)' }}
                        >
                          {r.include ? '포함됨' : '추가'}
                        </span>
                      </div>
                      {r.include && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
                          <TempToggle temp={r.temp} need={!r.temp} onPick={(t) => updateReview(r.id, { temp: t })} />
                          <input
                            value={r.menu}
                            onChange={(e) => updateReview(r.id, { menu: e.target.value })}
                            placeholder="메뉴명 입력"
                            style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, border: '1px solid var(--cc-line)', borderRadius: 9, padding: '7px 10px', outline: 'none', background: 'var(--cc-surface)' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
                            <div onClick={() => updateReview(r.id, { qty: Math.max(1, r.qty - 1) })} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MinusIcon /></div>
                            <span style={{ fontSize: 14, fontWeight: 800, minWidth: 12, textAlign: 'center' }}>{r.qty}</span>
                            <div onClick={() => updateReview(r.id, { qty: r.qty + 1 })} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon color="#1F6E50" size={15} strokeWidth="2.6" /></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <div onClick={() => setStep('upload')} style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: 'var(--cc-band)', color: 'var(--cc-ink2)', cursor: 'pointer' }}>다시 올리기</div>
              <div
                onClick={approve}
                style={{ flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 700, padding: 15, borderRadius: 14, background: needCount > 0 ? 'var(--cc-line)' : 'var(--cc-green)', color: needCount > 0 ? 'var(--cc-ink3)' : '#fff', cursor: needCount > 0 ? 'not-allowed' : 'pointer', boxShadow: needCount > 0 ? 'none' : '0 8px 18px rgba(31,110,80,.3)' }}
              >
                {finalOrders.length}건 추가하기
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
