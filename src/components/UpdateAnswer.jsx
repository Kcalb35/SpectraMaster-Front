import { Button, Form, Input, Checkbox, message } from "antd";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import 'antd/dist/antd.css'
import { uniFetch } from "../utils/apiUtil";
const { TextArea } = Input;


function UpdateAnswer(props) {
    let { id } = useParams();
    let [IonPeak, setIonPeak] = useState(0);
    const atomList = ['C', 'H', 'O', 'N', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];
    let [atoms, setAtoms] = useState(atomList.map(ele => 0));
    let [nmr, setNmr] = useState(true);
    let [mass, setMass] = useState(true);
    let [prob, setProb] = useState('');
    let [ans, setAns] = useState('');
    let [probPics, setProbPics] = useState([]);
    let [ansPics, setAnsPics] = useState([]);
    let [done, setDone] = useState(false);

    useEffect(() => {
        (async () => {
            let data = await uniFetch(`/ans/${id}`, { method: "GET" });
            if (data.ionPeak < 0) setMass(false);
            else {
                setMass(true);
                setIonPeak(data.ionPeak);
            }
            if (data.formula === null) setNmr(false);
            else {
                let li = atomList.map(e => data.formula[e.toLowerCase()]);
                setAtoms(li);
            }
            setProb(data.problem);
            setAns(data.answer);
        })();
    }, []);

    let checkmass = (e) => {
        let flag = e.target.checked;
        setIonPeak(flag ? 0 : -1);
        setMass(flag);
    };

    let checknmr = (e) => {
        let flag = e.target.checked;
        setAtoms(atomList.map(ele => flag ? 0 : -1));
        setNmr(flag);
    };

    let submit = () => {
        if (!nmr && !mass) {
            message.error('请至少添加一种谱图描述');
            return;
        }
        if (ans === '' || prob === '') {
            message.error('请输入详细的题干和题解');
            return;
        }
        let jwt = localStorage.getItem('jwt');
        if (jwt) {
            let headers = new Headers();
            headers.append("Authorization", `Bearer ${jwt}`);
            let formData = new FormData();
            formData.append('IonPeak', IonPeak);
            formData.append('Problem', prob);
            formData.append('Answer', ans);
            for (let i = 0; i < atomList.length; i++) {
                const element = atomList[i];
                formData.append(`Formula.${element}`, atoms[i]);
            }
            if (ansPics.length > 0)
                for (let i = 0; i < ansPics.length; i++) {
                    const file = ansPics[i];
                    formData.append('AnsFiles', file, file.name);
                }
            if (probPics.length > 0)
                for (let i = 0; i < probPics.length; i++) {
                    const file = probPics[i];
                    formData.append('ProbFiles', file, file.name);
                }

            let option = {
                method: 'PUT',
                headers: headers,
                body: formData,
            };
            (async () => {
                let response = await fetch(`/api/ans/${id}`, option);
                if (!response.ok) {
                    if (response.status === 401) {
                        message.error('没有权限或权限过期，请登录');
                        props.logout();
                    }
                } else {
                    message.success('提交成功');
                    setDone(true);
                }
            })();
        }
        else {
            message.error('没有权限或权限过期，请登录');
            props.logout();
        }
    }

    if (done) return (<Redirect to="/backend/answers"></Redirect>);
    else
        return (
            <div>
                <Checkbox checked={mass} onChange={checkmass}>质谱描述</Checkbox>
                <Checkbox checked={nmr} onChange={checknmr}>核磁描述</Checkbox>
                <Form layout="horizontal" style={{ margin: "10px 0 0 0 " }}>
                    <Form.Item label="分子离子峰" hidden={!mass}>
                        <Input
                            value={IonPeak}
                            onChange={e => { setIonPeak(e.target.value) }}
                            maxLength='10'
                        />
                    </Form.Item>
                    <div style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {atomList.map((atom, index) =>
                            <Form.Item label={atom} key={atom} hidden={!nmr} >
                                <Input maxLength="5"
                                    value={atoms[index]}
                                    onChange={e => { setAtoms(atoms.map((item, i) => i === index ? parseInt(e.target.value) : item)) }}
                                    style={{ width: 60 }}
                                ></Input>
                            </Form.Item>
                        )}
                    </div>
                    <Form.Item label='题目描述'>
                        <TextArea value={prob} onChange={e => setProb(e.target.value)} rows={3}></TextArea>
                    </Form.Item>
                    <Form.Item label='题目解析'>
                        <TextArea value={ans} onChange={e => setAns(e.target.value)} rows={5}></TextArea>
                    </Form.Item>
                    <Form.Item label='题目图片'>
                        <Input type='file' multiple={true} files={probPics} onChange={e => setProbPics(e.target.files)}></Input>
                    </Form.Item>
                    <Form.Item label='题解图片'>
                        <Input type='file' multiple={true} files={ansPics} onChange={e => { setAnsPics(e.target.files); }}></Input>
                    </Form.Item>
                    <Button type='primary' onClick={submit}>提交</Button>
                </Form>
            </div>
        );
}

export { UpdateAnswer };