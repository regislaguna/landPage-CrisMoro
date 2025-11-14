import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import toalha from '../../img/toalha.png';
import facial from '../../img/tratamentofacial.png';
import corporal from '../../img/tratamentocorporal.png';

const slidesData = [
  { id: 1, image: toalha, alt: 'Ambiente de spa com flores rosa' },
  { id: 2, image: facial, alt: 'Tratamento facial' },
  { id: 3, image: corporal, alt: 'Corpo relaxando' }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556228453-bf1973251c81?auto=format&fit=crop&w=1600&q=60';

function Carousel() {
  const handleImgError = (e) => {
    // troca o background via style se o carregamento falhar
    e.currentTarget.style.backgroundImage = `url(${FALLBACK_IMAGE})`;
  };

  return (
    <section className="relative w-full h-auto text-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
        spaceBetween={0}
        slidesPerView={1}
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative m-0 p-0"
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-label={slide.alt}
              onError={handleImgError}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Carousel;
