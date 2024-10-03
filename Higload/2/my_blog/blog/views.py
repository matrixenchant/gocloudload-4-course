from django.http import JsonResponse
from .models import Post, Comment
from django.db.models import Prefetch

from django.views.decorators.cache import cache_page

@cache_page(60)
def get_all(request):
    posts_with_comments = Post.objects.select_related('author').prefetch_related(
        Prefetch('comments', queryset=Comment.objects.select_related('author'))
    )

    print(posts_with_comments.query)

    data = []
    for post in posts_with_comments:
        data.append({
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'created_date': post.created_date,
            'comments': [
                {
                    'author': comment.author.username,
                    'content': comment.content,
                    'created_date': comment.created_date
                } for comment in post.comments.all()
            ]
        })

    return JsonResponse(data, safe=False)
