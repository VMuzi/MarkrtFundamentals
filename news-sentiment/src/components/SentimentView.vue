<template>
    <div class="wrapper">
        <div class="PickersAlign">
            <div class="datePick">
                <label>From Date</label>
                <div style="width: 250px;    margin-left: 11px;">
                    <Datepicker v-model="fromDate" />
                </div>
            </div>
            <div class="datePick" style="margin-left: -300px;">
                <label>To Date</label>
                <div style="width: 250px;margin-left: 11px;">
                    <Datepicker v-model="toDate" />
                </div>

            </div>
            <div class="datePick">
                <button class="ButtonStyle" @click="GetSentimentNews">Go</button>
            </div>
        </div>
        <br />
        <div class="row">
            <v-grid id="sView" ref="sView" theme="material" :columns="columns" :source="DataViewInfo"></v-grid>
        </div>
        <atom-spinner v-if="ShowSpinner" :animation-duration="1000" :size="60" color="#ff1d5e" />
    </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import VGrid from "@revolist/vue3-datagrid";
import newsService from '@/Utilities/newsService';
import sentimentService from '@/Utilities/sentimentService';
import { AtomSpinner } from 'epic-spinners'

export default {
    name: "SentimentView",
    components: {
        Datepicker,
        VGrid,
        AtomSpinner
    },
    setup() {

    },
    data() {
        return {
            fromDate: null,
            toDate: null,
            columns: [{ name: "Instrument Name", prop: "InstrumentName", size: 150 },
            {
                name: "Sentiment", prop: "Sentiment", size: 150, cellTemplate: (createElement, props) => {
                    debugger;
                    var color = '';
                    if (props.model.Sentiment === 'positive') {
                        color = 'darkseagreen';
                    } else if (props.model.Sentiment === 'negative') {
                        color = 'red';
                    } else if (props.model.Sentiment === 'slightly-positive' ||
                        props.model.Sentiment === 'slightly-negative' ||
                        props.model.Sentiment === 'neutral') {
                        color = 'blue';
                    }

                    return createElement('span', {
                        style: {
                            background: color
                        },
                    }, props.model[props.prop]);
                }
            },
            { name: "Sentiment Confidence", prop: "SentimentConfidence", size: 190 },
            { name: "News Count", prop: "NewsCount", size: 150 }],
            user: [
                { name: "DAX", positive: 2, negative: 80 },
                { name: "FSTE100", positive: 50, negative: 50 }
            ],
            searchIn: 'title,content,description',
            DAXQueryData: {
                q: '"DE30" OR "DAX" OR "DE40"',
                keywords: ["DE30", "DE40", "DAX"]
            },
            UK1OOQueryData: {
                q: '"FTSE100" OR "UK1OO" OR "FTSE"',
                keywords: ["UK100", "FTSE100", "FTSE"]
            },
            DataViewInfo: [],
            ShowSpinner: true
        }
    },
    async mounted() {
        this.fromDate = new Date();
        this.toDate = new Date();
        debugger;
        await this.GetSentimentNews();
    },
    methods: {
        UpdateGrid(args) {
            debugger;
        },
        async GetSentimentNews() {
            if (this.toDate < this.fromDate) {
                alert("End date can't be smaller than Start date");
                return;
            }
            this.ShowSpinner = true;
            debugger;
            //DAX
            try {

                var [isoFromDate] = this.fromDate.toISOString().split('T');
                var [isoToDtae] = this.toDate.toISOString().split('T');
                var daxNews = await newsService.GetEverything(this.$NewsURL, this.$ApiKey, this.$EverythingEndpoint,
                    this.DAXQueryData.q, null, null, null, null, isoFromDate, isoToDtae);
                var combinedText = '';

                this.DataViewInfo = [];
                if (daxNews.data !== null && daxNews.data.totalResults !== 0) {
                    daxNews.data.articles.forEach(news => {
                        if (news.title.toUpperCase().includes(this.DAXQueryData.keywords[0]) ||
                            news.title.toUpperCase().includes(this.DAXQueryData.keywords[1]) ||
                            news.title.toUpperCase().includes(this.DAXQueryData.keywords[2]) ||
                            news.description.toUpperCase().includes(this.DAXQueryData.keywords[0]) ||
                            news.description.toUpperCase().includes(this.DAXQueryData.keywords[1]) ||
                            news.description.toUpperCase().includes(this.DAXQueryData.keywords[2])) {
                            combinedText += '\n' + news.content;
                        }
                    });
                    var sentimentResult = await sentimentService.AnalyseExtract(this.$AnalysisApiKey, this.$TextAnalysisEndpoint,
                        combinedText);

                    var daxCurrentInfo = { InstrumentName: "DAX" };
                    daxCurrentInfo.NewsCount = daxNews.data.totalResults;
                    if (sentimentResult) {
                        daxCurrentInfo.Sentiment = sentimentResult.data.sentiment;
                        daxCurrentInfo.SentimentConfidence = sentimentResult.data.confidence;

                    } else {
                        daxCurrentInfo.Sentiment = 'N/A';
                        daxCurrentInfo.SentimentConfidence = 0;
                    }
                    this.DataViewInfo.push(daxCurrentInfo);

                    console.log(JSON.stringify(this.DataViewInfo));

                } else {
                    var daxEmpty = { InstrumentName: "DAX", Sentiment: "N/A", SentimentConfidence: 0, NewsCount: 0 }
                    this.DataViewInfo.push(daxEmpty);
                }

                //UK100
                var ftseNews = await newsService.GetEverything(this.$NewsURL, this.$ApiKey, this.$EverythingEndpoint,
                    this.UK1OOQueryData.q, null, null, null, null, isoFromDate, isoToDtae);
                combinedText = '';
                if (ftseNews.data !== null && ftseNews.data.totalResults !== 0) {
                    ftseNews.data.articles.forEach(news => {
                        if (news.title.toUpperCase().includes(this.UK1OOQueryData.keywords[0]) ||
                            news.title.toUpperCase().includes(this.UK1OOQueryData.keywords[1]) ||
                            news.title.toUpperCase().includes(this.UK1OOQueryData.keywords[2]) ||
                            news.description.toUpperCase().includes(this.UK1OOQueryData.keywords[0]) ||
                            news.description.toUpperCase().includes(this.UK1OOQueryData.keywords[1]) ||
                            news.description.toUpperCase().includes(this.UK1OOQueryData.keywords[2])) {
                            combinedText += '\n' + news.content;
                        }
                    });
                    var ftseSentimentResult = await sentimentService.AnalyseExtract(this.$AnalysisApiKey, this.$TextAnalysisEndpoint,
                        combinedText);

                    var ftseCurrentInfo = { InstrumentName: "UK100" };
                    ftseCurrentInfo.NewsCount = ftseNews.data.totalResults;
                    if (ftseSentimentResult) {
                        ftseCurrentInfo.Sentiment = ftseSentimentResult.data.sentiment;
                        ftseCurrentInfo.SentimentConfidence = ftseSentimentResult.data.confidence;

                    } else {
                        ftseCurrentInfo.Sentiment = 'N/A';
                        ftseCurrentInfo.SentimentConfidence = 0;
                    }
                    this.DataViewInfo.push(ftseCurrentInfo);

                    console.log(JSON.stringify(this.DataViewInfo));

                } else {
                    var ftseEmpty = { InstrumentName: "UK100", Sentiment: "N/A", SentimentConfidence: 0, NewsCount: 0 }
                    this.DataViewInfo.push(ftseEmpty);
                }
                var grid = document.getElementById('sView');
                grid.source = [];
                grid.source = this.DataViewInfo;
                this.ShowSpinner = false;
            } catch (err) {
                console.log(`Error retrieving sentiments: ${err}`);
                this.ShowSpinner = false;
                return;
            }

        },
    }
}
</script>

<style>
.body {
    margin: 0;
    font-family: Poppins, sans-serif;
    font-size: .875rem;
    font-weight: 400;
    line-height: 1.5;
    color: #525f7f;
    text-align: left;
    background-color: #1e1e2f;
}

.wrapper {
    position: relative;
    top: 0;
    height: 100vh;
}

.main-panel {
    position: relative;
    float: right;
    width: 100%;
    min-height: 100vh;
    border-top: 2px solid #e14eca;
    /* background: -webkit-gradient(linear,left top,left bottom,from(#1e1e2f),to(#1e1e24)); */
    background: linear-gradient(#1e1e2f, #1e1e24);
    -webkit-transition: all .5s cubic-bezier(.685, .0473, .346, 1);
    transition: all .5s cubic-bezier(.685, .0473, .346, 1);
}

.datePick {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.PickersAlign {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

revo-grid {
    height: 800px;
    margin-left: 442px;
    width: 600px;
}

.ButtonStyle {
    background-color: #13ce66 !important;
    color: #fff;
    padding: 10px 20px;
    border: 1px solid #ddd;
    /* color: #333; */
    background-color: #fff;
    border-radius: 4px;
    font-size: 14px;
    font-family: '微软雅黑', arail;
    cursor: pointer;
    width: 120px;
    margin-left: -200px;
}
</style>