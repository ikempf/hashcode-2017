let _ = require("lodash");

function run(spec) {
    return spec;
}

let requests = [{
    endpoint: 1,
    video: 1,
    count: 10
},{
    endpoint: 2,
    video: 2,
    count: 20
},{
    endpoint: 3,
    video: 1,
    count: 15
}];

let videos = [
    {id: 1, size: 10},
    {id: 2, size: 20}
];

let endpoints = [
    {id: 1, latencyDataCenter: 1, caches: [{id: 1, latency: 10}, {id: 2, latency: 10}]},
    {id: 2, latencyDataCenter: 2, caches: [{id: 2, latency: 20}]},
    {id: 3, latencyDataCenter: 3, caches: [{id: 1, latency: 10000}, {id: 2, latency: 10}]}
];

let caches = [
    {id: 1, size: 10000},
    {id: 2, size: 2000}
];

function a(vid, end, req, cac) {
    return req.map(r => {
        let e = _.find(end, {id: r.endpoint});
        return {
            // endpoint: e,
            caches: e.caches.map(c => {
                let v = _.find(vid, {id: r.video});
                let c2 = _.find(cac, {id: c.id});
                return {
                    endpoint: e,
                    video: v,
                    cache: c2,
                    score: v.size * r.count / c.latency
                };
            })
        };
    })
}

console.log(JSON.stringify(flatten(a(videos, endpoints, requests, caches)), null, 4));

function flatten(list) {
    let list2 = _.flatMap(list);
    let list3 = _.flatMap(list2, l => l.caches);
    let list4 = _.map(list3, l => {
        return {
            video: l.video,
            cache: l.cache,
            score: l.score
        }
    });
    let res = _.groupBy(list4, c => c.cache.id);
    return res;
}

// function select(cac, scores) {
//     _.sortBy(scores, ['score']).reverse()
//         .map(s => {
//             if (s.cache.size < s.video.size) {
//
//             }
//         })
// }
//
// function endpointToLatency(e) {
//     return
// }

module.exports = {
    run
};