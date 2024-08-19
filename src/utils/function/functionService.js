import { logoutService } from '@/services/user/authService';
import { verifyTokenService } from '@/services/user/authService';

const functionService = () => {
    return {
        verifyTokenService: verifyTokenService,
        logoutService: logoutService,
    };
};

export default functionService;
