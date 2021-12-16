import Link from 'next/link';
import Image from 'next/image';

export default function HomepageHeader({ pageTitle, pageSubtitle, ctaButtons }) {
  return (
    <div className='p-8 my-6 mx-auto text-center flex-col items-center justify-center max-w-3xl'>
      <h1 className='text-6xl font-bold text-navy whitespace-normal mb-5'>{pageTitle}</h1>
      <p className='text-lg text-gray-500 mb-6'>{pageSubtitle}</p>
      <div className='flex p-2 items-center justify-center'>
        {ctaButtons.map((button, index) => {
          return (
            <Link key={index} href={button.button.url}>
              <button className='bg-blue-500 rounded-lg py-3 px-6 m-2 text-white even:bg-blue-100 even:text-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500 transition-all'>
                {button.button.title}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
