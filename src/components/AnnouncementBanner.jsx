export function AnnouncementBanner({ visible, text }) {
  if (!visible) return null
  return (
    <div className="announcement-banner">
      <span>{text}</span>
    </div>
  )
}
