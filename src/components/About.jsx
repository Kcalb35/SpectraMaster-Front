function About() {
    return (
        <div style={{ margin: '10px 30px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>关于本项目</h1>
            <p>

                本项目旨在为化学系《高等有机化学——波谱分析》课程建立配套习题库。
            在2020-2021冬学期，开发者选修了《波谱分析》课程。
            在准备期末考试之际，产生了编写考试复习题的idea，遂与各位贡献者一同收集了大部分课堂习题，并查阅资料逐一给出习题解(秘)析(籍)，给出了SpectroMaster的初稿。
            在这份复习资料的帮助下，各位编者获得了理想的课程成绩。开发者利用春学期完善了有关资料并完成了SpectroMaster网站的建设，可以通过索引查找课程范围内的习题与答案，现共享给今后每一届选修《波谱分析》的学弟学妹们——祝愿人人成为“解谱小专家”。

        </p>
            <p>注意由贡献者编写部分的许可遵循<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh">CC-BY-NC-SA</a>，其他部分的版权归各自的作者。资料仅供参考，请自行判断其正确性与适用性</p>
            <p style={{textAlign:'right'}}>——你们的开发者学长ヾ(ｏ･ω･)ﾉ </p>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>贡献列表</h1>
            <p><b>内容：</b>璜磊 洪子宸 何易城  许浩锋 黄晨舟 赵政杰 吴昱彤 沈银琳 王承志 牟凯豪 金元甲 李心愉 钱璞凡 李嘉祺 郑家瑜 李俊逸 周弋渤（按时间顺序）</p>
            <p><b>技术：</b>璜磊</p>

            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>帮助</h1>
            <ol>
                <li>根据题目是否有质谱描述和核磁描述搜题</li>
                <li>无分子离子峰，请按分子离峰为0搜索；无分子式，请按所有元素原子数为0搜索</li>
            </ol>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>如有疑问</h1>
            <p>如果有疑问或发现了bug，请通过邮件(1163416056@qq.com)，QQ(1163416056)联系，或给<a href="https://github.com/Kcalb35/SpectraMaster-Front">前端项目</a>提issure。</p>
            <p>如果您也想成为网站或内容项目的维护者，也可以通过上面的方式联系。</p>

        </div>
    )
}

export default About