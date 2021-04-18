import { useEffect, useState } from "react";
import { uniFetch } from "../utils/apiUtil";

function MainPage(props) {

    let [num, setNum] = useState(0);

    useEffect(() => {
        (async () => {
            let data = await uniFetch('/ans/all');
            setNum(data.length);
        })();
    }, []);

    return (
        <div style={{height:'70vh',display:'flex',justifyContent:'center',flexDirection:'column'}}>
            <p style={{ textAlign: 'center',fontSize:'40px'}}>共有{num}道题解</p>
        </div>
    );
}



export default MainPage;