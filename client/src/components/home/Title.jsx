import React from 'react'

const Title = ({ title, description }) => {
  return (
    <div className='flex flex-col items-center text-center mt-4'>
      <h2 className='text-4xl md:text-5xl font-bold text-slate-900 tracking-tight'>{title}</h2>
      <div className="h-1 w-16 bg-primary-accent rounded-full mt-6 mb-8"></div>
      <p className='max-w-2xl text-lg text-slate-500 leading-relaxed font-medium'>{description}</p>

      <style>{`
          .bg-primary-accent { background-color: #F95200; }
        `}</style>
    </div>
  )
}

export default Title