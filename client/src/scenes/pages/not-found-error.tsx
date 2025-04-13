import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { IconFileUnknown } from '@tabler/icons-react';


export default function NotFoundError() {
  const navigate = useNavigate()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Aw man! Page Not Found!</span>
        <p className='text-center text-muted-foreground'>
          Page you're looking for <br />
          does not exist
        </p>
        <IconFileUnknown />
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
