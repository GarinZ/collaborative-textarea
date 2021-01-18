# Collaborative-Textarea
A text area supporting real-time collaborative editing plain text. And display all the online attendees.
See Also：[How to implemente Collaborative Document - CHS](http://garinzhang.com/coding/how-to-implemente-collaborative-editing-understanding-operational-transformation.html)
![](https://garinzhang-blog.oss-cn-beijing.aliyuncs.com/2021-01-14-140733.png)
## Online Demo
[Collaborative-Textarea-Online-Demo](http://garinzhang.com/collaborative-textarea/)
## Development
This project involve view(Browser) and server(Node.js)
### Server
Server default listen on port = 4000
```
cd server
yarn install
yarn start
```
### View
View will implicit start a webpackServer on port 3000, and will proxy all the requests to `http://localhost:4000`, which is server is default listening.
If you want to change it, open the `package.json` and change the `proxy` property.
```
cd view
yarn install
yarn start
```
## Tech Stack
- UI: React + Redux + AntDesign
- IO: socket.io
- Server: Express + Node.js
- Collaborative: base on ot.js and make some change

## TODO
- [x] support real-time plain text collaborativly editing
- [x] support display attendees list and enter/quit notification
- [ ] support undo management
- [ ] support markdown synatx operational transformation and preview
