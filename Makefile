NAME = 42-ft_transendence

POSTGRESQL_VOLUME = trancendence_posgresdb
DEV_POSTGRESQL_VOLUME = dev_trancendence_posgresdb

all : prod

dev :
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod :
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down :
	docker compose down

clean_dev_volume : down
	docker volume rm $(NAME)_$(DEV_POSTGRESQL_VOLUME)

rm_prod_volume : down
	docker volume rm $(NAME)_$(POSTGRESQL_VOLUME)

rm_img :
	docker rmi $(NAME)-nestjs
	docker rmi $(NAME)-nextjs

re_dev : clean_dev all

re_prod : clean_prod all

.PHONY : all down clean_dev clean_prod re dev prod rm_img
