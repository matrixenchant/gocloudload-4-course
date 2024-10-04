from django.http import JsonResponse
from .models import Post, Comment
from django.db.models import Prefetch

from django.shortcuts import get_object_or_404, redirect, render

from django.views.decorators.cache import cache_page
from django.core.cache import cache

@cache_page(60)
def get_all(request):
    posts_with_comments = Post.objects.select_related('author').prefetch_related(
        Prefetch('comments', queryset=Comment.objects.select_related('author'))
    )

    data = []
    for post in posts_with_comments:
        data.append({
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'created_date': post.created_date,
            'commentsCount': get_comment_count(post.id),
            'comments': [
                {
                    'author': comment.author.username,
                    'content': comment.content,
                    'created_date': comment.created_date
                } for comment in post.comments.all()
            ]
        })

    return JsonResponse(data, safe=False)

def get_comment_count(post_id):
    cache_key = f'comment_count_{post_id}'
    comment_count = cache.get(cache_key)

    if comment_count is None:
        comment_count = Comment.objects.filter(post_id=post_id).count()
        cache.set(cache_key, comment_count, timeout=60)

    return comment_count

def post_detail(request, post_id):
    post = get_object_or_404(Post.objects.prefetch_related('comments'), id=post_id)

    return render(request, 'detail.html', {'post': post})

def cache_reset(request, post_id):
    # post = get_object_or_404(Post, id=post_id)

    cache_key = f'blog_post_{post_id}'
    cache.delete(cache_key)

    if cache.get(cache_key) is None:
        print(f'Кеш для {cache_key} успешно сброшен.')
    else:
        print(f'Ошибка: Кеш для {cache_key} не сброшен.')

    cache.delete(f'comment_count_{post_id}')

    return JsonResponse(True, safe=False)