export type RootStackParamList = {
    First:undefined
    Account:undefined
    'Login': { loginMethod: 'email' | 'phone'; refresh: () => void };
    "Reset Password":{ mode: 'email' | 'phone' };
    "Sign Up":{ refresh?: () => Promise<void> };
    "Admin Login":undefined
    "Admin Main":undefined
    "View Students":undefined

    "TabNavigator":undefined;
    "Profile": { studentId: number; studentName: string;studentEmail:string;studentPhone:string,studentPassword:string,studentBalance:number};
    "User Profile & Settings":{ studentId: number; studentName: string;studentEmail:string;studentPhone:string}
    "Wallet":{studentId:number,studentPassword:String,studentBalance:number};
    "Help & Support":undefined;
    "Edit Profile":undefined;
    "Payment":{ studentBalance: number,studentId:number };
    "OrderScreen":undefined;
    'Main Screen': { studentId: number; studentName: string;studentEmail:string;studentPhone:string;studentPassword:string,studentBalance:number};
    'Change Password':{studentPhone:string}
};