import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        )}
        <span className='font-medium'>Whoops! Something went wrong {`:')`}</span>
        <p className='text-center text-muted-foreground'>
          Forgive us for this error. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
            </div>
        )}
      </div>
    </div>
  )
}
