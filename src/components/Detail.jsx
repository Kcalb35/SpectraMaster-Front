import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { uniFetch } from "../utils/apiUtil";
import "antd/dist/antd.css"
import { Image, Card,Button } from "antd";

function Answer() {
    let { id } = useParams();
    let [ansPics, setAnsPics] = useState([])
    let [probPics, setProbPics] = useState([])
    let [prob, setProb] = useState("")
    let [ans, setAns] = useState("")

    useEffect(() => {
        (async () => {
            let data = await uniFetch(`/ans/${id}`, { method: "GET" });
            console.log(data);
            setProb(data.problem)
            setAns(data.answer)
            setProbPics(data.problemPics)
            setAnsPics(data.answerPics)
        })();
    }, [])


    return (
        <div>
            <Card title="题目描述" size="small">
                <p>{prob}</p>
                <DisplayPics pic={probPics} alt="problem picture" />
            </Card>
            <Card title="题目解析" size="small">
                <p>{ans}</p>
                <DisplayPics pic={ansPics} alt="answer picture" />
            </Card>
            <Button style={{margin:"10px 0 0 8px"}} type="primary">修改</Button>

        </div>
    )
}

function DisplayPics(props) {
    return (
        <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-around",flexWrap:"wrap"}}>
            {props.pic.map(ele => <Image key={ele} width="40%" alt={props.alt} src={`${process.env.REACT_APP_IMAGE_PATH}/images/${ele}`} />)}
        </div>
    )
}


export { Answer, DisplayPics }