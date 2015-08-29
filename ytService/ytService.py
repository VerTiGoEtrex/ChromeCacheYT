#!/usr/bin/env python3
import tornado.ioloop
import tornado.web
import youtube_dl
import json
from functools import lru_cache
from operator import itemgetter

class MainHandler(tornado.web.RequestHandler):
    def get(self, slug):
        self.set_header("Access-Control-Allow-Origin", "*")
        if slug == None:
            return
        result = MainHandler.getVideoUrl(slug)
        print(MainHandler.getVideoUrl.cache_info())
        self.write({"dlUrl": result})

    @staticmethod
    @lru_cache(maxsize=(2**30)//1024)
    def getVideoUrl(id):
        with youtube_dl.YoutubeDL() as ydl:
            info = ydl.extract_info(id, download=False)
            if info == None:
                return
            nonDashFormats = [x for x in info["formats"] if "format_note" not in x or "DASH" not in x["format_note"]]
            mp4ContainerFormats = [x for x in nonDashFormats if x["ext"] == "mp4"]
            maxSizeFormat = max(mp4ContainerFormats, key=itemgetter('width'))
            return maxSizeFormat

app = tornado.web.Application([
    (r'/getJson/([a-zA-Z0-9_\-]{11})', MainHandler),
])

if __name__=="__main__":
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
