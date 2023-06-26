import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
  roles?: UserRole[];
}

const data: IMenuItem[] = [
  {
    icon: 'iconsminds-shop-4',
    label: 'menu.mydashboard',
    to: `${adminRoot}/mydashboard`,
    roles: [UserRole.Admin, UserRole.Editor]
  },
  {
    icon: 'iconsminds-air-balloon-1',
    label: 'menu.projectpricing',
    to: `${adminRoot}/projectpricing`,
    roles: [UserRole.Admin, UserRole.Editor]
  },
  {
    icon: 'iconsminds-digital-drawing',
    label: 'menu.team',
    to: `${adminRoot}/team`,
  },
  {
    icon: 'iconsminds-library',
    label: 'menu.Admin',
    to: `${adminRoot}/Admin`,
  },
  {
    icon: 'iconsminds-library',
    label: 'menu.salesforecast',
    to: `${adminRoot}/salesforecast`,
    roles: [UserRole.Admin]
  }
  // {
  //   icon: 'iconsminds-library',
  //   label: 'menu.assets',
  //   to: `${adminRoot}/assets`,
  // },
  // {
  //   icon: 'iconsminds-library',
  //   label: 'menu.livechart',
  //   to: `${adminRoot}/livechart`,
  // },
  // {
  //   icon: 'iconsminds-library',
  //   label: 'menu.purchasepremium',
  //   to: `${adminRoot}/purchasepremium`,
  // },
];
export default data;
