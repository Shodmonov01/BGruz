// import { useTotals } from "@/lib/TotalsContext";
// import CurrentTime from "./сurrent-time";
// import logo from "../../../public/logoRb.png";

// function BgruzHeader() {
//     const { fullPrice, fullPriceNDS, commission } = useTotals();

//     return (
//         <div className="hidden md:flex items-center justify-between gap-2 pb-5">
//             <div className="flex gap-1 justify-center items-center md:text-2xl">
//                 <img src={logo} alt="logo" className="h-20" />
//                 <span className="text-[#03B4E0]">Биржа</span>
//                 <span className="">Грузоперевозок</span>
//             </div>
//             <div>
//                 <CurrentTime />
//             </div>
//             <div>
//                 <ul className="text-[14px]">
//                     <li>
//                         Сумма заявок: <span>{fullPrice.toLocaleString()}</span>
//                     </li>
//                     <li>
//                         Комиссия: <span>{commission.toLocaleString()}</span>
//                     </li>
//                     <li>
//                         К оплате: <span>{fullPriceNDS.toLocaleString()}</span>
//                     </li>
             
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default BgruzHeader;


import { useTotals } from "@/lib/TotalsContext";
import logo from "../../../public/logoRb.png";
import CurrentTime from "./сurrent-time";

function BgruzHeader() {
    const { fullPrice, fullPriceNds, commission } = useTotals();

    return (
        <div className="hidden md:flex items-center justify-between gap-2 pb-5">
            <div className="flex gap-1 justify-center items-center md:text-2xl">
                <img src={logo} alt="logo" className="h-20" />
                <span className="text-[#03B4E0]">Биржа</span>
                <span className="">Грузоперевозок</span>
            </div>
            <div>
                <CurrentTime />
            </div>

            <div>
                <ul className="text-[14px]">
                    <li>
                        Сумма заявок: <span>{fullPrice.toLocaleString()}</span>
                    </li>
                    <li>
                        Комиссия: <span>{commission.toLocaleString()}</span>
                    </li>
                    <li>
                        К оплате: <span>{fullPriceNds.toLocaleString()}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default BgruzHeader;
