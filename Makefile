NAME = 42-ft_transendence

POSTGRESQL_VOLUME = trancendence_posgresdb
DEV_POSTGRESQL_VOLUME = dev_trancendence_posgresdb
DEV_REDIS_VOLUME = dev_redis_volume
REDIS_VOLUME = redis_volume
NGINX_CDN_VOLUME = cdn_volume
DEV_NGINX_CDN_VOLUME = dev_cdn_volume

ifeq ($(OS),Windows_NT)
HOST_IP :=127.0.0.1
else ifeq ($(shell uname -s),Linux)
HOST_IP :=$(shell ip addr show | grep 'inet ' | awk '{print $2}' | tail -n 1 | cut -d/ -f1 | sed 's/inet //')
else ifeq ($(shell uname -s),Darwin)
HOST_IP :=$(shell ifconfig -l | xargs -n1 ipconfig getifaddr | head -n1)
endif
HOST_URL := http://$(HOST_IP)

host_url:
	@echo $(HOST_URL)

dev :
ifeq ($(OS),Windows_NT)
	copy .\envs\prod.env .\.env
else
	cp ./envs/prod.env ./.env
endif
ifeq ($(OS),Windows_NT)
	powershell -Command "(gc .\.env) -replace 'HOST_URL=.*', 'HOST_URL=$(HOST_URL)' | Out-File -encoding ASCII .\.env"
else ifeq ($(shell uname -s),Linux)
	sed -i 's/^HOST_URL=.*/HOST_URL=$(HOST_URL)/' ./.env
else ifeq ($(shell uname -s),Darwin)
	sed -i '' 's/^HOST_URL=.*/HOST_URL=$(HOST_URL)/' ./.env
endif
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod :
ifeq ($(OS),Windows_NT)
	copy .\envs\prod.env .\.env
else
	cp ./envs/prod.env ./.env
endif
ifeq ($(OS),Windows_NT)
	powershell -Command "(gc .\.env) -replace 'HOST_URL=.*', 'HOST_URL=$(HOST_URL)' | Out-File -encoding ASCII .\.env"
else ifeq ($(shell uname -s),Linux)
	sed -i 's/^HOST_URL=.*/HOST_URL=$(HOST_URL)/' ./.env
else ifeq ($(shell uname -s),Darwin)
	sed -i '' 's/^HOST_URL=.*/HOST_URL=$(HOST_URL)/' ./.env
endif
	docker-compose up --build

start:
	docker compose start

restart:
	docker compose restart

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

.PHONY : down clean_dev clean_prod re dev prod rm_img rm_everything_prod rm_everything_dev start restart host_url
