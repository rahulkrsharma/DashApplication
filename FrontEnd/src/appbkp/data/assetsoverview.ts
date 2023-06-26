import { Assets, AssetsOverview, Liabilities, Networth} from '../../app/views/app/dashboards/dashboard.service'


export const assets : AssetsOverview[] = [
        {
            userId : 2,
            month : 'Jan 20',
            bankAccount : 8500,
            stocksEtf : 2000,
            crypto : 500,
            preciousMetals : 2000,
            realState : 400,
            otherAssets : 500,
            loans : 0,
            mortgage : 0,
            creditCards : 0,
            otherLiablities : 0,
            networth : 13900,
            monthlyDifference : 0,
            fluctuation : 0
        },
        {
            userId: 2,
            month : 'Feb 20',
            bankAccount : 8100,
            stocksEtf : 2000,
            crypto : 550,
            preciousMetals : 2100,
            realState : 406,
            otherAssets : 500,
            loans : 1000,
            mortgage : 0,
            creditCards : 0,
            otherLiablities : 0,
            networth : 14156,
            monthlyDifference : 255,
            fluctuation : 2
            
        }
];

// export const liablities : Liabilities[] = [
//     {
//       loans : 0,
//       mortgage : 0,
//       creditCards : 0,
//       Others : 0
//     },
//     {
//         loans : 1000,
//         mortgage : 0,
//         creditCards : 0,
//         Others : 0
//       }
// ];

// export const networth : Networth[] = [
//     {
//         networth : 13900,
//         monthlyDifference : 0,
//         fluctuation : 0
//     },
//     {
//         networth : 14156,
//         monthlyDifference : 255,
//         fluctuation : 2
//     }
// ];

// export const assetsOverview = 
//     { userId,
//       assets: assets,
//     };



