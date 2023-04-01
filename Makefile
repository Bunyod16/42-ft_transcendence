NAME = 42-ft_transendence

POSTGRESQL_VOLUME = trancendence_posgresdb
DEV_POSTGRESQL_VOLUME = dev_trancendence_posgresdb

all : prod

dev :
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

prod :
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

down :
	docker compose down

clean_dev : down
	docker volume rm $(NAME)_$(DEV_POSTGRESQL_VOLUME)
	docker rmi $(NAME)-nestjs
	docker rmi $(NAME)-nextjs

clean_prod : down
	docker volume rm $(NAME)_$(POSTGRESQL_VOLUME)
	docker rmi $(NAME)-nestjs
	docker rmi $(NAME)-nextjs

re : clean all

.PHONY : all down clean_dev clean_prod re dev prod
