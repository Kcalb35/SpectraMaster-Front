import "./SearchAnswer.css"
import React, { useState } from "react";
import { Input, Button, Form, message, Tooltip } from "antd";
import { uniFetch } from "../utils/apiUtil";
import { Collapse, Checkbox } from "antd";
import { DisplayPics } from "./Detail";
import "antd/dist/antd.css"
import { Link } from "react-router-dom";
const { Panel } = Collapse;

function SearchComplex(props) {
    let [minIonPeak, setminIonPeak] = useState(0);
    let [maxIonPeak, setmaxIonPeak] = useState(0);

    const atomList = ['C', 'H', 'O', 'N', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];
    let [atoms, setAtoms] = useState(atomList.map(ele => -1));
    let [entries, setEntries] = useState([]);
    let [nmr, setNmr] = useState(false);
    let [mass, setMass] = useState(true);

    let checkmass = (e) => {
        let flag = e.target.checked;
        setmaxIonPeak(flag ? 0 : -1);
        setminIonPeak(flag ? 0 : -1);
        setMass(flag);
    }
    let checknmr = (e) => {
        let flag = e.target.checked;
        setAtoms(atomList.map(ele => flag ? 0 : -1));
        setNmr(flag);
    }

    let search = () => {
        if (!nmr && !mass) {
            message.error("请至少勾选一项题目特征");
            return;
        }
        if (minIonPeak === '') {
            message.error("请输入最小范围")
            return;
        }
        if (maxIonPeak === '') {
            message.error("请输入最大范围")
            return;
        }
        let formula = {};
        for (let i = 0; i < atomList.length; i++) {
            let n = parseInt(atoms[i])
            if (isNaN(n)) {
                message.error(`请输入整数:${atomList[i]}原子数`);
                return;
            }
            formula[atomList[i].toLowerCase()] = n;
        }
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
            catch (e) {
                message.error(e.errMsg);
                setEntries([]);
            }
        })();
    }

    let allnmr = () => {
        (async () => {
            let data = await uniFetch("/ans/all", { method: "GET" });
            setEntries(data.filter(e => e.formula != null));
        })();
    }
    let allmass = () => {
        (async () => {
            let data = await uniFetch("/ans/all", { method: "GET" });
            setEntries(data.filter(e => e.ionPeak >= 0));
        })();
    }

    let DisplayFormula = (props) => {
        let formulaTag = []
        for (let i = 0; i < atomList.length; i++) {
            let n = parseInt(atoms[i]);
            if (isNaN(n)) break;
            if (n > 1) {
                formulaTag.push(<span>{atomList[i]}<sub>{n}</sub></span>);
            }
            else if (n === 1) {
                formulaTag.push(<span>{atomList[i]}</span>);
            }
        }
        return (<span>{formulaTag}</span>);
    }

    return (
        <div>
            <div style={{ margin: "0 0 5px 5px" }}>
                <Tooltip title="当有质谱请勾这个">
                    <Checkbox checked={mass} onChange={checkmass}>查质谱</Checkbox>
                </Tooltip>
                <Tooltip title="当有核磁谱请勾这个">
                    <Checkbox checked={nmr} onChange={checknmr}>查核磁</Checkbox>
                </Tooltip>
                <Button style={{ padding: "4px 4px" }} type="link" onClick={allmass}>查看所有质谱题解</Button>
                <Button style={{ padding: "4px 4px" }} type="link" onClick={allnmr}>查看所有核磁题解</Button>
            </div>
            <Form layout="horizontal" style={{ margin: "0 0 10px 0" }}>
                <Form.Item
                    hidden={!mass}
                    label="分子离子峰质荷比"
                    tooltip={{ title: "确定分子离子峰上下界可一样；无分子离子峰全填0" }}
                    style={{ marginBottom: '5px' }}
                >
                    <Input.Group compact>
                        <Tooltip
                            trigger={['focus']}
                            title="分子离子峰下界"
                        >
                            <Input
                                placeholder="Minimum"
                                value={minIonPeak}
                                style={{ width: 100, textAlign: 'center' }}
                                onChange={(e) => { setminIonPeak(e.target.value) }}
                            />
                        </Tooltip>
                        <Input style={{
                            width: 30,
                            borderLeft: 0,
                            borderRight: 0,
                            pointerEvents: 'none',
                        }} placeholder="~" disabled
                        />
                        <Tooltip
                            trigger={['focus']}
                            title="分子离子峰上界"
                        >
                            <Input
                                placeholder="Maximum"
                                value={maxIonPeak}
                                onChange={(e) => { setmaxIonPeak(e.target.value) }}
                                style={{ width: 100, textAlign: 'center' }}
                            />
                        </Tooltip>
                    </Input.Group>
                </Form.Item>

                <div hidden={!nmr} >
                    <Form.Item label="分子式" tooltip={{ title: "无分子式则全填0" }} style={{ marginBottom: '5px' }}>

                        <div id="formula-layout">
                            {atomList.map((atom, index) =>
                                <Input addonBefore={atom} value={atoms[index]} size="small" onChange={(e) => { setAtoms(atoms.map((item, i) => i === index ? e.target.value : item)) }} style={{ width: 100, textAlign: 'center' }} />
                            )}
                        </div>
                    </Form.Item>
                    <div>
                        当前分子式：<DisplayFormula atoms={atoms}></DisplayFormula>
                    </div>
                </div>
            </Form>
            <Button type="primary" onClick={search} style={{ marginBottom: '20px' }}>搜索</Button>

            {entries.length > 0 && (
                <div>
                    <div>有{entries.length}条搜索记录</div>
                    <Collapse accordion>

                        {entries.map(ele =>
                            <Panel
                                header={<span>
                                    {(ele.formula != null) && (<span>分子式：<b>{convert(ele.formula)}&nbsp;&nbsp;&nbsp;&nbsp;</b></span>)}
                                    {(ele.ionPeak >= 0) && (<span>离子峰：<b>{ele.ionPeak}</b></span>)}
                                </span>}
                                extra={<Link to={`/answer/${ele.id}`} >查看解析</Link>}>
                                <p>{ele.problem}</p>
                                <DisplayPics pic={ele.problemPics} width="40%" />
                            </Panel>
                        )}
                    </Collapse>
                </div>
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