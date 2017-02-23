let _ = require("lodash");

function run(spec) {
    return a(spec.videoSizes, spec.endpoints, spec.requests, spec.caches);
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

let videos = {
    1: {size: 10},
    2: {size: 20}
};

let endpoints = {
    1: {latencyDataCenter: 1, caches: [{id: 1, latency: 10}, {id: 2, latency: 10}]},
    2: {latencyDataCenter: 2, caches: [{id: 2, latency: 20}]},
    3: {latencyDataCenter: 3, caches: [{id: 1, latency: 10000}, {id: 2, latency: 10}]}
};

let caches = {
    1: {size: 10000},
    2: {size: 2000}
};

function a(vid, end, req, cac) {

    _(req)
        .map(r => end[r.endpoint].caches.map(c => {
            let v = vid[r.video];
            return {
                video: v,
                cacheId: c.id,
                score: v.size * r.count / c.latency
            };
        }))
        .flatMap()
        .groupBy(c => c.cacheId)
        .forEach((l, k) => {
            let res = _(l)
                .sortBy(c => c.score)
                .reverse()
                .map(e => {
                    if (e.video.size > cac[e.cacheId].size) {
                        return -1;
                    } else {
                        cac[e.cacheId].size -= e.video.size;
                        return e.video.id;
                    }
                })
                .uniq()
                .filter(e => e >= 0);
            console.log(k + " " + res.join(" "))
        });

}

let blah = JSON.stringify(a(videos, endpoints, requests, caches), null, 4);
//
console.log(blah);

module.exports = {
    run
};