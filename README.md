Scopes
======

Real-time professional video scopes for modern web browsers.

These scopes are intended as components that can be used by developers
to implement scope capabilities in their video or image solutions. The 
scopes are typically used during color correction and grading stage and 
provides valuable information of what needs to be corrected or adjusted.

The scopes are professional grade using standard BT.709, BT.2020 and BT.601 
as well as linear luma conversion, but is limited to 8-bit values due to 
browser limitations.

The scope package includes Histogram, Waveform, RGB Parade and Vector scopes.

It is assumed you are familiar with the concepts and usage of video scopes.

**GPL2 and commercial licenses available, see below for more details.**


Features (alpha/preview)
--------

- Histogram scope with support for individual R/G/B channels as well as luma and in combinations.
- Waveform scope with support for R/G/B or luma
- RGB Parade scope
- Vector scope for RGB (YUV is not supported at the moment as it's not common in use) using linear projection.
- Real-time scoping with various quality settings for some scopes
- Accurate representation.
- BT./Rec.709, BT./Rec.2020, BT./Rec.601 as well as linear luma conversion
- Configurable

Possible future implementations:
- 2D Histogram
- Luma tracker (useful for time-lapse recordings)
- Vector scope representing YUV (not commonly used)


Demo
----

**[Online demo can be found here.](http://epistemex.github.io/scopes/test_vid.html)**


Dual License
------------

For personal non-commercial use a GPLv2 license is provided. The term "personal", as used in this License, refers to 
non-business use. The term "non-commercial", as used in this License, means academic or other scholarly research which (a) is not 
undertaken for profit, or (b) is not intended to produce works, services, or data for commercial use, or (c) is neither conducted, 
nor funded, by a person or an entity engaged in the commercial use, application or exploitation of works similar to the Software.

The Software is available to commercial and business use through a separate license which must be purchased from Epistemex. This
commercial license allows for closed source use. [Contact us](mailto:github@epistemex.com) for details.


Snapshots
---------

**Histogram RGB:**

![Histogram RGB](https://i.imgur.com/nuNJpK5.png)

**Histogram luminance:**

![Histogram Luma](https://i.imgur.com/oW3ah2M.png)

**Waveform RGB:**

![Waveform RGB](https://i.imgur.com/t5wb9Xy.png)

**Waveform Luma:**

![Waveform Luma](https://i.imgur.com/Gn4KQTW.png)

**RGB Parade:**

![RGB Parade](https://i.imgur.com/rveApq5.png)

**Vector:**

![Vector](https://i.imgur.com/Pl3N8N7.png)


*&copy; Epistmex 2015-2018*
 
![Epistemex](http://i.imgur.com/GP6Q3v8.png)
