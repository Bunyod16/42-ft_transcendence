NAME = 42-ft_transendence

POSTGRESQL_VOLUME = trancendence_posgresdb
DEV_POSTGRESQL_VOLUME = dev_trancendence_posgresdb
DEV_REDIS_VOLUME = dev_redis_volume
REDIS_VOLUME = redis_volume
NGINX_CDN_VOLUME = cdn_volume
DEV_NGINX_CDN_VOLUME = dev_cdn_volume

all : dev

dev :
ifeq ($(OS),Windows_NT)
	copy .\envs\dev.env .\.env
else
	cp .\envs\dev.env .\.env
endif
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod :
ifeq ($(OS),Windows_NT)
	copy .\envs\prod.env .\.env
else
	cp .\envs\prod.env .\.env
endif
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down :
	docker compose down

dev_down:
	docker compose down --volumes

rm_dev_volume :
	docker volume rm --force $(NAME)_$(DEV_REDIS_VOLUME)
	docker volume rm --force $(NAME)_$(DEV_POSTGRESQL_VOLUME)
	docker volume rm --force $(NAME)_$(DEV_NGINX_CDN_VOLUME)

rm_prod_volume :
	docker volume rm $(NAME)_$(REDIS_VOLUME)
	docker volume rm $(NAME)_$(POSTGRESQL_VOLUME)
	docker volume rm $(NAME)_$(NGINX_CDN_VOLUME)

rm_img :
	docker rmi $(NAME)-nestjs
	docker rmi $(NAME)-nextjs

re_dev : dev_down rm_dev_volume dev

re_prod : down rm_dev_volume prod

rm_everything_dev: dev_down down rm_dev_volume rm_img

rm_everything_prod: down rm_prod_volume rm_img

.PHONY : all down clean_dev clean_prod re dev prod rm_img rm_everything_prod rm_everything_dev
