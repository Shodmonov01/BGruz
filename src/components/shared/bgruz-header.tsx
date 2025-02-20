import CurrentTime from "./сurrent-time"

import logo from '../../../public/logoRb.png'


function BgruzHeader() {
    return (
        <div className='hidden md:flex items-start justify-between gap-2 pb-5'>
            <div className='flex gap-1 justify-center items-center'>
                <img src={logo} alt='logo' className='h-10' />
                <span className='text-[#03B4E0]'>Биржа</span>
                <span className=''>Грузоверевозок</span>
            </div>
            <div>
                <CurrentTime />
            </div>

            <div>
                <ul className='text-[14px]'>
                    <li>
                        Сумма заявок: <span>10 000 000</span>
                    </li>
                    <li>
                        Комиссия: <span>500 000</span>
                    </li>
                    <li>
                        К оплате: <span>9 500 000</span>
                    </li>
                    <li>
                        и НДС: <span>1 900 000</span>
                    </li>
                </ul>
            </div>

            {/* <div>
                <p>Амир Шодмонов</p>
                <p>admin@mail.com</p>
            </div> */}
        </div>
    )
}

export default BgruzHeader
