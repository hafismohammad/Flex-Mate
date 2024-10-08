import { Request, Response } from 'express';
import AdminService from '../services/adminService';
import { ILoginAdmin } from '../interface/admin_interface';

class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password }: ILoginAdmin = req.body;
      console.log('admin data', email, password);
      
      const admin = await this.adminService.adminLogin({ email, password }); 
      if (admin) {

        const {accessToken, refreshToken} = admin
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });


        console.log('Admin authenticated successfully');
        res.status(200).json({ message: 'Login successful', admin:admin.admin, token: accessToken });
      } else {
        console.log('Admin authentication failed');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AdminController;
