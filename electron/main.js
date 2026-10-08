const {app,BrowserWindow}=require('electron'); const path=require('path');
function create(){const w=new BrowserWindow({width:1280,height:800,minWidth:900,minHeight:600,backgroundColor:'#080b12',webPreferences:{contextIsolation:true}}); w.loadFile(path.join(__dirname,'../app/index.html'));}
app.whenReady().then(()=>{create();app.on('activate',()=>BrowserWindow.getAllWindows().length||create())}); app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
