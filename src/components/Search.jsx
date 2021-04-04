import "./Search.css"
import React, { useEffect, useState } from "react";
import { Input, Button, Form } from "antd";
import { uniFetch } from "../utils/apiUtil";
import { Card } from "antd";
import { DisplayPics } from "./Detail";
import "antd/dist/antd.css"
import { Link } from "react-router-dom";

function SearchComplex(props) {
    let [minIonPeak, setminIonPeak] = useState(props.mass ? 0 : -1);
    let [maxIonPeak, setmaxIonPeak] = useState(props.mass ? 0 : -1);

    const atomList = ['C', 'H', 'O', 'N', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];
    let [atoms, setAtoms] = useState(atomList.map(ele => props.nmr ? 0 : -1));

    let [entries, setEntries] = useState([]);

    useEffect(() => {
        console.log(props)
        if (!props.mass) {
            setminIonPeak(-1);
            setmaxIonPeak(-1);
        }
        else {
            setmaxIonPeak(0);
            setminIonPeak(0);
        }

        if (!props.nmr)
            setAtoms(atomList.map(ele => -1));
        else setAtoms(atomList.map(ele => 0));
        setEntries([]);
    }, [props.mass, props.nmr]);

    let search = () => {
        let formula = {};
        for (let i = 0; i < atomList.length; i++)
            formula[atomList[i].toLowerCase()] = atoms[i]
        console.log(atoms);
        let body = {
            minIonPeak: minIonPeak,
            maxIonPeak: maxIonPeak,
            formula: formula
        };
        console.log(body);
        let option = {
            method: "POST",
            body: body
        };
        (async () => {
            let data = await uniFetch("/ans/search", option);
            console.log(data);
            setEntries(data);
        })();
    }
    return (
        <div>
            <Form layout="horizontal">
                <div hidden={!props.mass}>
                    <h2>分子离子峰质荷比</h2>
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
                <div hidden={!props.nmr}>
                    <h2>分子式</h2>
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
                    <DisplayPics pic={ele.problemPics} />
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
            if (n > 0) {
                atoms.push(<span>{ele}<sub>{n}</sub></span>)
            }
        });
    }
    return (
        <span>
            {atoms}
        </span>
    );
}

export default SearchComplex;