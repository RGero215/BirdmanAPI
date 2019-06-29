# BirdmanAPI
![IMG_1089](https://user-images.githubusercontent.com/10387470/60122660-8d896580-973a-11e9-81e5-0d9e94cc65f0.jpg)

Contract project for a baseball bat company operation.
User are able to create an account, sell bats by creating order sheets,
create orders, refer other sellers, multi level marketing up to 4 tiers and
register custom bats.
Admin can see all users, order sheets, orders, inventory and register bats.
# Admin
If database is empty or has no users, is_admin = true. After creating the first user and admin the default users are not admin or is_admin = false.

# // GET /
Page 404

# // GET /users
Only admin is authorized to view all users.
Else page not_authorized.

# // GET /users/login
Initial view to login or register.

# // GET /users/register
Initial view to login or register.

# // POST /users/register
Create a new user

# // POST /users/login
To login with user's credentials.

# // POST /users/logout
Logout and destroy session.

# //GET /users/create
Admin can create more users and admins. This is the Form.

# // POST /users
Admin create more users and admins.

# // GET /users/:uid
If user is login this route will show Direct Users. If user not log in a sign up now form is display and if new user sign up using this route then is created as a direct connection tier one or refer by :uid. Users can share this unique route with their friends and contacts to get direct user referals.

Note: if direct contact uses // GET /users/login or // GET /users/register to signup it won't count as a direct user referal to :uid that refer them so make sure they use your unique route to signup under your network // GET /users/:uid.

# // POST /users/:uid/register
Creates user under referal tier one.

#  // PUT /users/:uid
Update specific user

# // DELETE /user/:uid
Delete specific user

# // GET /users/:uid/order_sheet
All order_sheet

# // GET /users/:uid/order_sheet/create
Form to create order_sheet

# // GET /users/:uid/order_sheet
GET a specific order_sheet

# // POST /users/:uid/order_sheet
Route for create an order_sheet

# // PUT /users/:uid/order_sheet/:osid
Edit a specific order_sheet

# // Delete /users/:uid/order_sheet/:osid
Delete a specific order_sheet

# // GET /users/:uid/order_sheet/:osid/ordes
GET all orders in an order sheet

# // GET /users/:uid/order_sheet/:osid/orders/create
Form to create an order

# // POST /users/:uid/order_sheet/:osid/ordes
Create orders in an order sheet

# // GET /users/:uid/order_sheet/:osid/ordes/:oid
GET a specific order in an order sheet

# // GET /users/:uid/order_sheet/:osid/ordes/:oid/update
Update specific order

# // GET /users/:uid/order_sheet/:osid/ordes/:oid/delete
DELETE orders in an order sheet

# // GET /users/:uid/inventory
GET Inventory

# // GET /users/:uid/inventory/add_to_inventory
Form to add to the inventory

# // POST /users/:uid/inventory/add_to_inventory
Add to inventory

# // GET /users/:uid/inventory/:update/update
Get form to update item in the inventory

# // GET /users/:uid
GET all tier one members

# // GET /users/:uid/tierTwo
GET all tier two members

# // GET /users/:uid/tierThree
GET all tier three members

# // GET /users/:uid/tierFour
// GET all tier four members

# // GET /users/:uid/bats_register
GET all bats register

# // POST /users/:uid/bats_register
Creates bat 

# // GET /users/:uid/all_bats
Display all files (Image are broken down in files chunk)

# // GET /users/:uid/all_bats/:filename
Display single file

# // GET /users/:uid/image/:filename
Display baseball bat image

# // GET /users/:uid/bats_register/:filename/delete
Delete bat 








