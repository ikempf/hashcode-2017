let _ = require("lodash");

function run(spec) {
    return spec;
}

let requests = [{
    endpoint: 1,
    video: 1,
    count: 10
}, {
    endpoint: 2,
    video: 2,
    count: 20
}, {
    endpoint: 3,
    video: 1,
    count: 15
}];

let videos = [
    {id: 1, size: 99},
    {id: 2, size: 1}
];

let endpoints = [
    {id: 1, latencyDataCenter: 1, caches: [{id: 1, latency: 10}, {id: 2, latency: 10}]},
    {id: 2, latencyDataCenter: 2, caches: [{id: 2, latency: 20}]},
    {id: 3, latencyDataCenter: 3, caches: [{id: 1, latency: 10000}, {id: 2, latency: 10}]}
];

let caches = [
    {id: 1, size: 1000},
    {id: 2, size: 10}
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

function flatten(list, cac) {
    let res = {};
    _(list)
        .flatMap()
        .flatMap(l => l.caches)
        .map(l => {
            return {
                video: l.video,
                cache: l.cache,
                score: l.score
            }
        })
        .groupBy(c => c.cache.id)
        .forEach((l, k) => {
            res[k] = _(l)
                .sortBy(c => c.score)
                .reverse()
                .map(e => {
                    if (e.video.size > _.find(cac, {id: e.cache.id}).size) {
                        return -1;
                    } else {
                        _.find(cac, {id: e.cache.id}).size -= e.video.size;
                        return e.video.id;
                    }
                })
                .uniq()
                .filter(e => e >= 0);
        });
    return res;
}

let blah = JSON.stringify(flatten(a(videos, endpoints, requests, caches), caches), null, 4);

console.log(blah);

module.exports = {
    run
};