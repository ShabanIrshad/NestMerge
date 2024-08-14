# NestMerge
This NestMerge project is the very first backend project that I create using MERN.
It USES MOngoDB,JsonWebToken,ReactJs,NodeJs
bcrypt :encryption and dycryption for password handler.
body-parser : for using and retriving values from DOM.
cookie-parser : handling token value for user activation or deactivation.
cors : for handling files.
nodemon: for server running .
# Consist of such things:
userRoute : Handling the requests like - post/get/patch and redirecting to the page Register,Login,Logout
, Get User,Login Status,ChangePassword.

userModel : Consist of the parameter of creating User(userSchema), Encryption of Password and hashing it.

# Middlewares
errorHandler : for throwing status code as 500 if any error cought.

authMiddleware : Using jsonWebToken authentication of user using Cookies(token). Compare UserId for handling user.
 # Controller
 userController : using functionalities like- GenerateToken, Register user, Login, Logout, GetUser and change password.
 

