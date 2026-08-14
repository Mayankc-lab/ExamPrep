import {BsFacebook, BsInstagram,BsLinkedin, BsTwitter} from 'react-icons/bs';

function Footer(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    return(
        <>
            <footer className='fixed bottom-0 left-0 w-full sm:h-[10vh] h-[15vh] py-5 sm:px-20 sm:pb-2 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-900'>
                <section>
                        Copyright {year} | All rights resvered
                </section>
                <section className='flex  items-center justify-center gap-5 text-2xl text-white'>
                    <a className=' hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsFacebook/>
                    </a>
                    <a className=' hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsInstagram/>
                    </a>
                    <a className=' hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsLinkedin/>
                    </a>
                    <a className=' hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsTwitter/>
                    </a>
                </section>
            </footer>
        </>
    )
}
export default Footer;