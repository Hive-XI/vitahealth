import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useVita } from '../context'
import { Button } from './ui'

export function LogoutButton({
  className = '',
  variant = 'ghost',
}: {
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}) {
  const navigate = useNavigate()
  const { logout } = useVita()

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        logout()
        navigate('/')
      }}
    >
      <LogOut className="size-4" aria-hidden />
      Log out
    </Button>
  )
}
