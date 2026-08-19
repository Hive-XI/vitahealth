export function ClinicianPhoto({
  className = '',
}: {
  className?: string
}) {
  return (
    <img
      src="/vita-clinician.png"
      alt="A smiling doctor in a white lab coat with a stethoscope, standing in a hospital corridor."
      className={`object-cover object-[center_22%] ${className}`}
    />
  )
}
