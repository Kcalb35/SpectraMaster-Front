import "./SearchAnswer.css"
import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { uniFetch } from "../utils/apiUtil";
import { Card ,Checkbox} from "antd";
import { DisplayPics } from "./Detail";
import "antd/dist/antd.css"
import { Link } from "react-router-dom";

function SearchComplex(props) {
    let [minIonPeak, setminIonPeak] = useState( 0 );
    let [maxIonPeak, setmaxIonPeak] = useState( 0 );

    const atomList = ['C', 'H', 'O', 'N', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];
    let [atoms, setAtoms] = useState(atomList.map(ele =>0 ));
    let [entries, setEntries] = useState([]);
    let [nmr,setNmr] = useState(true);
    let [mass,setMass] = useState(true);

    let checkmass=(e)=>{
        let flag = e.target.checked;
        setmaxIonPeak(flag?0:-1);
        setminIonPeak(flag?0:-1);
        setMass(flag);
    }
    let checknmr=(e)=>{
        let flag = e.target.checked;
        setAtoms(atomList.map(ele=> flag?0:-1));
        setNmr(flag);
    }

    let search = () => {
        let formula = {};
        for (let i = 0; i < atomList.length; i++)
            formula[atomList[i].toLowerCase()] = atoms[i]
        let body = {
            minIonPeak: minIonPeak,
            maxIonPeak: maxIonPeak,
            formula: formula
        };
        let option = {
            method: "POST",
            body: body
        };
        (async () => {
            try {
                let data = await uniFetch("/ans/search", option);
                setEntries(data);
            }
            catch(e){
                message.error(e.errMsg);
                setEntries([]);
            }
        })();
    }
    return (
        <div>
            <Checkbox checked={mass} onChange={checkmass}>查质谱</Checkbox>
            <Checkbox checked={nmr} onChange={checknmr}>查核磁</Checkbox>
            <Form layout="horizontal">
                <div hidden={!mass}>
                    <h3>分子离子峰质荷比</h3>
                    <Form.Item label="范围下界"  >
                        <Input
                            placeholder="min Ion Peak"

                            value={minIonPeak}
                            maxLength="10"
                            onChange={(e) => { setminIonPeak(e.target.value) }}
                        />
                    </Form.Item>

                    <Form.Item label="范围上界">
                        <Input
                            placeholder="max Ion Peak" value={maxIonPeak} maxLength="10" onChange={(e) => { setmaxIonPeak(e.target.value) }}
                        />
                    </Form.Item>
                </div>
                <div hidden={!nmr}>
                    <h3>分子式</h3>
                    <div id="formula-layout">
                        {atomList.map((atom, index) => <Form.Item label={atom} key={atom} >
                            <Input maxLength="5" value={atoms[index]} size="small" onChange={(e) => { setAtoms(atoms.map((item, i) => i === index ? parseInt(e.target.value) : item)) }} style={{ width: 60 }} />
                        </Form.Item>)}
                    </div>
                </div>
                <Form.Item>
                    <Button type="primary" onClick={search}>搜索</Button>
                </Form.Item>
            </Form>

            {entries.map(ele =>
                <Card
                    title={<div>
                        {(ele.formula != null) && <b>分子式：</b>}<span>{convert(ele.formula)}&nbsp;</span>
                        {(ele.ionPeak != null) && <b>离子峰：</b>}<span>{ele.ionPeak}</span>
                    </div>}
                    style={{ marginTop: "10px" }}
                    headStyle={{ background: "#fafafa" }}
                    extra={<Link to={`/answer/${ele.id}`} >查看解析</Link>}>
                    <p>{ele.problem}</p>
                    <DisplayPics pic={ele.problemPics} width="40%" />
                </Card>
            )}
        </div >
    )
}


function convert(formula) {
    let atoms = []
    if (formula != null) {
        const atomList = ['C', 'H', 'O', 'N', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];
        atomList.forEach(ele => {
            let c = ele.toLowerCase()
            let n = formula[c]
            if (n > 1) {
                atoms.push(<span>{ele}<sub>{n}</sub></span>)
            }
            else if (n > 0) {
                atoms.push(<span>{ele}</span>)
            }
        });
    }
    return (
        <span>
            {atoms}
        </span>
    );
}

export { SearchComplex, convert };