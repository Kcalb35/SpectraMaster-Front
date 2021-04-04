import { useEffect, useState } from "react";
import { uniFetch } from "../utils/apiUtil";

function MainPage(props) {

    let [num,setNum] = useState(0);

    useEffect(() => {
        (async()=>{
            let data = await uniFetch('/ans/all');
            for (let i = 0; i <= data.length; i++) {
               setNum(i); 
            }
        })();
    }, []);

    return (
        <div >
            <p style={{textAlign:'center',lineHeight:'60vh',fontSize:'1000',fontSize:'80px'}}>共有{num}道题解</p>
        </div>
    );
}



export default MainPage;