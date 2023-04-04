NAME = 42-ft_transendence

POSTGRESQL_VOLUME = trancendence_posgresdb
DEV_POSTGRESQL_VOLUME = dev_trancendence_posgresdb

all : dev

dev :
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod :
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down :
	docker compose down

rm_dev_volume :
	docker volume rm $(NAME)_$(DEV_POSTGRESQL_VOLUME)

rm_prod_volume :
	docker volume rm $(NAME)_$(POSTGRESQL_VOLUME)

rm_img :
	docker rmi $(NAME)-nestjs
	docker rmi $(NAME)-nextjs

re_dev : down rm_dev_volume dev

re_prod : down rm_dev_volume prod

rm_everything_dev: down rm_dev_volume rm_img

rm_everything_prod: down rm_prod_volume rm_img

.PHONY : all down clean_dev clean_prod re dev prod rm_img rm_everything_prod rm_everything_dev
