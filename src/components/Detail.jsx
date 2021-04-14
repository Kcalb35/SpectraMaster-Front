import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { uniFetch } from "../utils/apiUtil";
import { Image, Card, Button, Table, Popconfirm, message } from "antd";
import { convert } from "./SearchAnswer";
import "antd/dist/antd.css"
import './Detail.css'
import '../App.css'

function Answer() {
    let { id } = useParams();
    let [ansPics, setAnsPics] = useState([])
    let [probPics, setProbPics] = useState([])
    let [formula, setFormula] = useState(null)
    let [peak, setPeak] = useState(-1);
    let [prob, setProb] = useState("");
    let [ans, setAns] = useState("");

    useEffect(() => {
        (async () => {
            let data = await uniFetch(`/ans/${id}`, { method: "GET" });
            setProb(data.problem.replace('\n','\r\n'));
            setAns(data.answer.replace('\n','\r\n'));
            setProbPics(data.problemPics);
            setAnsPics(data.answerPics);
            setFormula(data.formula);
            setPeak(data.ionPeak);
        })();
    }, []);

    return (
        <div>
            <Card title="题目描述" size="small">
                {formula && <p><b>分子式：</b>{convert(formula)}</p>}
                {peak >= 1 && <p><b>分子离子峰：</b>{peak}</p>}
                <div className="display-linebreak">{prob}</div>
                <DisplayPics pic={probPics} width="40%" alt="problem picture" />
            </Card>
            <Card title="题目解析" size="small">
                <div className="display-linebreak">{ans}</div>
                <DisplayPics pic={ansPics} width="40%" alt="answer picture" />
            </Card>
            <Button style={{ margin: "10px 0 0 8px" }} type="primary"><Link to={`/backend/update/${id}`}>修改</Link></Button>
        </div>
    )
}

function AnswersList(props) {

    let [source, setSource] = useState([])

    let deleteAnswer = (id) => {
        let jwt = localStorage.getItem('jwt');
        if (jwt) {
            (async () => {
                try {
                    let option = { method: "DELETE", jwt: jwt };
                    let data = await uniFetch(`/ans/${id}`, option);
                    message.success("删除成功");
                } catch (err) {
                    if (err.code === 401) {
                        localStorage.removeItem('jwt');
                        props.logout();
                        message.error(err.msg);
                    }
                }
            })();
        }
    }

    let fresh = async () => {
        let data = await uniFetch('/ans/all', { method: 'GET' });
        setSource(data.map(ans => {
            return {
                id: ans.id,
                peak: ans.ionPeak >= 0 ? ans.ionPeak : null,
                problem: ans.problem,
                problemPics: ans.problemPics,
                formula: ans.formula
            }
        }));
    }
    useEffect(() => {
        fresh();
    }, []);

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (<Link key={text} to={`/answer/${record.id}`}>{text}</Link>),
            width: '5%'

        },
        {
            title: '分子式',
            dataIndex: 'formula',
            key: 'formula',
            render: f => (f && convert(f)),
            width: '8%'
        },
        {
            title: '分子离子峰',
            dataIndex: 'peak',
            key: 'peak',
            width: '8%'
        },
        {
            title: '题目描述',
            dataIndex: 'problem',
            key: 'problem',
            width: '20%'
        },
        {
            title: '缩略图',
            dataIndex: 'problemPics',
            key: 'problemPics',
            render: (problemPics, record) => (problemPics && <DisplayPics key={`pics${record.id}`} pic={problemPics} width="45%" />)
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div className="btn-edit-box">
                    <Button key={`detail${record.id}`} size="small" className="btn-edit"><Link to={`/answer/${record.id}`}>查看</Link></Button>
                    <Button key={`update${record.id}`} size="small" className="btn-edit"><Link to={`/backend/update/${record.id}`}>修改</Link></Button>
                    <Popconfirm
                        title="是否删除题解"
                        onConfirm={() => { deleteAnswer(record.id) }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button key={`delete${record.id}`} danger size="small" className="btn-edit" >删除
                        </Button>
                    </Popconfirm>

                </div>
            )
        }
    ]
    return (
        <div>
            <Button type="primary" style={{ margin: '0 0 10px 0' }}><Link to="/backend/create">添加题解</Link></Button>
            <Button type='primary' style={{ margin: '0 0 10px 10px'}} onClick={props.logout}><Link to="/login">退出登录</Link></Button>
            <Table columns={columns} dataSource={source} key="table"></Table>
        </div>
    );
}

function DisplayPics(props) {
    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" }}>
            {props.pic.map(ele => <Image key={ele} width={props.width} alt={props.alt} src={`${process.env.REACT_APP_IMAGE_PATH}/images/${ele}`} />)}
        </div>
    )
}


export { Answer, DisplayPics, AnswersList }