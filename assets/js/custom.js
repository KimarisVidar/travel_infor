var ogjData;
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = function () {
    ogjData = JSON.parse(xhr.responseText);
    Index.init();
};
var index = function () {
    var val;
    var id      = 0;
    var listAry = [];
    var text    = '三民區';
    // 初始資料        
    this.initial = function () {
        // 預設三民區
        $('#selet-box option[value="' + id + '"]').attr('selected', 'selected');
        val = $('#selet-box option[value="' + id + '"]').text();
    }
    this.domEvent = function () {
        var _this = this;
        $('#selet-box').on('change', function () {
            text = $('#selet-box :selected').text();
            _this.mainRender(text);
        });
1
        $('.hot-content ul li').on('click', function () {
            text = $(this).text();
            var value = $(this).attr('value');
            _this.resetHtml(value);
            _this.mainRender(text);
        });

        $('#areaPage li').on('click', function () {
            var clickNum = $(this).text();
            if (clickNum == 1) {
                var _text = $('#content-title').text();
                _this.mainRender(_text);
            } else {
                _this.navClick_render(clickNum);
            }
        })
    }
    this.selectRender = function () {
        let html;
        var _this       = this;
        let select      = [];
        let selectAry   = [];
        let selectData  = ogjData.result.records;
        // 只取區的value
        for (let i in selectData) {
            let zone = selectData[i].Zone;
            selectAry.push(zone);
            select = selectAry.filter(function (el, idx, arr) {
                return arr.indexOf(el) === idx;
            });
        }
        for (let j = 0; j < select.length; j++) {
            html += `<option value="${j}">${select[j]}</option>`;
        }
        $('#selet-box').append(html);
    }
    this.resetHtml = function (val) {
        $('#selet-box option').removeAttr('selected');
        $('#selet-box option[value="' + val + '"]').attr('selected', 'selected');
    }
    this.mainRender = function (text) {
        let html;
        let num         = 0;
        let _this       = this;
        let mainData    = ogjData.result.records;
        listAry         = [];
        $('#content-title').text(text);
        $('#content ul').html('');
        for (let i in mainData) {
            if (mainData[i].Zone == text) {
                listAry.push(i);
                num++;
                if (num <= 10) {
                    html += `<li class="contentLi-style" data-id="${mainData[i]._id}">
                                <figcaption>
                                    <img src="${mainData[i].Picture1}"/>
                                    <figure class="name">${mainData[i].Name}</figure>
                                    <figure class="area">${mainData[i].Zone}</figure>
                                </figcaption>
                                <div class="contentText-block ">
                                    <ul>
                                        <li class="area-time">${mainData[i].Opentime}</li>
                                        <li class="area-position">${mainData[i].Add}</li>
                                        <li class="area-phone">
                                            <div>${mainData[i].Tel}</div>
                                            <div class="area-tag">${mainData[i].Ticketinfo}</div>
                                        </li>
                                    </ul>
                                </div>
                            </li>`;
                    html = html.replace('undefined', '');
                }
            }
        }
        $('#content ul').append(html);
        _this.navList();
    }
    this.navClick_render = function (num) {
        let html;
        let ary     = [];
        let ary1    = [];
        let s_num   = (num * 10) - 9;
        let e_num   = num * 10;
        let text    = $('#content-title').text();
        let mainData = ogjData.result.records;

        for (let i in mainData) if (mainData[i].Zone == text) ary.push(mainData[i]);
        for (let i = s_num - 1; i <= e_num; i++) if (ary[i] !== undefined) ary1.push(ary[i]);
        
        $('#content ul').html('');
        
        for (let j = 0; j < ary1.length; j++) {
            html += `<li class="contentLi-style" data-id="${ary1[j]._id}">
                        <figcaption>
                            <img src="${ary1[j].Picture1}"/>
                            <figure class="name">${ary1[j].Name}</figure>
                            <figure class="area">${ary1[j].Zone}</figure>
                        </figcaption>
                        <div class="contentText-block ">
                            <ul>
                                <li class="area-time">${ary1[j].Opentime}</li>
                                <li class="area-position">${ary1[j].Add}</li>
                                <li class="area-phone">
                                    <div>${ary1[j].Tel}</div>
                                    <div class="area-tag">${ary1[j].Ticketinfo}</div>
                                </li>
                            </ul>
                        </div>
                    </li>`;
            // 出現不名 undefined 移除
            html = html.replace('undefined', '');
        }
        $('#content ul').append(html);
    }
    this.navList = function () {
        let html;
        let num = listAry.length / 10;
        $('#areaPage').html('');
        html += `<li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
        for (let i = 0; i < num; i++) {
            html += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
        }
        html += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`;
        html = html.replace('undefined', '');
        $('#areaPage').append(html);
    }
    this.init = function () {
        var _this = this;
        $(document).ready(function () {
            _this.selectRender();
            _this.initial();
            _this.mainRender(val);
            _this.domEvent()
        });
    }
}
var Index = new index();