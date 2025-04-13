import { Button } from '@/components/ui/button'

export default function MaintenanceError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>Page is under maintenance!</span>
        <p className='text-center text-muted-foreground'>
          This route is not available at the moment. <br />
          It'll be back up shortly. <br />
          Sorry to inconvenience you.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>Learn more</Button>
        </div>
      </div>
    </div>
  )
}
