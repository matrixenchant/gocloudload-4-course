package utils

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

var redisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

func GetCachedData(ctx context.Context, key string) (string, error) {
	return redisClient.Get(ctx, key).Result()
}

func SetCacheData(ctx context.Context, key string, value string, expiration time.Duration) error {
	return redisClient.Set(ctx, key, value, expiration).Err()
}

func DeleteCachedData(ctx context.Context, key string) error {
	return redisClient.Del(ctx, key).Err()
}
