import random

from PIL import Image
from PIL.GifImagePlugin import getheader
from PIL import GifImagePlugin
from PIL.ExifTags import TAGS, GPSTAGS
from PIL.ImageSequence import Iterator
GifImagePlugin._FORCE_OPTIMIZE = True

class Img:
    __MODES = {
        '1': 'black and white',
        'L': 'grayscale',
        'LA': 'grayscale with transparency',
        'P': 'color palette',
        'RGB': 'true color',
        'RGBA': 'true color with transparency',
        'RGBX': 'true color with padding',
        'RGBa': 'true color with premultiplied alpha',
        'CMYK': 'color separation',
        'YCbCr': 'color video',
        'LAB': 'l*a*b color space',
        'HSV': 'hue, saturation, value color space',
        'I': 'signed integer pixels',
        'F': 'floating point pixels'
    }
    __ATTRIBUTES = ('size', 'width', 'height', 'mode')
    __METHODS = ('convert', 'crop', 'filter', 'paste', 'resize', 'rotate',
                 'thumbnail', 'transform', 'transpose')

    __image = None
    __exif = None
    __frames = None

    @property
    def info(self):
        return self.__image.info

    @property
    def exif(self):
        if self.__exif is None:
            self.__exif = {}

            try:
                for key, value in self.__image._getexif().items():
                    tag = TAGS.get(key, key)
                    self.__exif[tag] = {
                        GPSTAGS.get(key_, key_): value_
                        for key_, value_ in value.items()
                    } if tag == 'GPSInfo' else value
            except AttributeError:
                pass

        return self.__exif

    @property
    def format(self):
        return self.__image.format

    @property
    def mode_desc(self):
        return self.__MODES.get(self.mode)

    @property
    def frame_count(self):
        if self.__frames:
            return len(self.__frames)

        try:
            return self.__image.n_frames
        except AttributeError:
            return 1

    @property
    def animated(self):
        return self.frame_count > 1

    @property
    def frames(self):
        self.load()

        return self.__frames

    def __init__(self, fp):
        self.__image = Image.open(fp)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()

    def __getattr__(self, name):
        if name in self.__ATTRIBUTES:
            return getattr(self.__frames[0]
                           if self.__frames else self.__image, name)

        if name in self.__METHODS:
            self.load()

            def proxy(*args, **kwargs):
                for index, frame in enumerate(self.__frames):
                    res = getattr(frame, name)(*args, **kwargs)
                    if isinstance(res, Image.Image):
                        self.__frames[index] = res

            return proxy

        raise AttributeError

    def load(self, limit=None, first=True):
        if self.__frames is None:
            indexes = list(range(self.frame_count))
            if limit:
                if not first:
                    mix = indexes[1:]
                    random.shuffle(mix)
                    indexes[1:] = mix
                indexes = indexes[:limit]

            self.__frames = [
                frame.copy()
                for index, frame in enumerate(Iterator(self.__image))
                if index in set(indexes)
            ]

    def save(self, fp):
        self.load()

        if not self.__frames:
            return
        durations = [f.info.get('duration', 100) for f in self.__frames]
        options = {'save_all': True, 'append_images': self.__frames[1:]} \
            if self.format == 'GIF' and self.animated else {}
        self.__frames[0].info = self.info
        self.__frames[0].info['duration'] = durations
        self.__frames[0].save(fp, format=self.format, optimize=True, **options)

    def close(self):
        self.__image.close()
